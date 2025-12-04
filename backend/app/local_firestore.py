from typing import Any, Dict, List, Optional, AsyncGenerator
import time
import asyncio
from dataclasses import dataclass, field

class MockDeleteField:
    pass

DELETE_FIELD = MockDeleteField()

class MockArrayUnion:
    def __init__(self, values):
        self.values = values

class MockArrayRemove:
    def __init__(self, values):
        self.values = values

class LocalDocumentSnapshot:
    def __init__(self, id: str, data: Optional[Dict[str, Any]], exists: bool):
        self.id = id
        self._data = data
        self.exists = exists

    def to_dict(self) -> Optional[Dict[str, Any]]:
        return self._data

class LocalDocumentReference:
    def __init__(self, parent: 'LocalCollectionReference', id: str):
        self.parent = parent
        self.id = id
        self._db = parent.db

    async def get(self, transaction=None) -> LocalDocumentSnapshot:
        data = self._db._data.get(self.parent.name, {}).get(self.id)
        import copy
        data_copy = copy.deepcopy(data) if data is not None else None
        return LocalDocumentSnapshot(self.id, data_copy, data is not None)

    async def set(self, data: Dict[str, Any], merge: bool = False):
        if self.parent.name not in self._db._data:
            self._db._data[self.parent.name] = {}
        
        if merge and self.id in self._db._data[self.parent.name]:
            self._db._data[self.parent.name][self.id].update(data)
        else:
            self._db._data[self.parent.name][self.id] = data

    async def update(self, data: Dict[str, Any]):
        if self.parent.name not in self._db._data or self.id not in self._db._data[self.parent.name]:
            raise Exception(f"Document {self.id} not found for update")
        
        current_doc = self._db._data[self.parent.name][self.id]
        self._apply_update(current_doc, data)

    def _apply_update(self, current_doc: Dict[str, Any], data: Dict[str, Any]):
        for key, value in data.items():
            if isinstance(value, MockDeleteField) or value == DELETE_FIELD:
                self._delete_field(current_doc, key)
            elif "." in key:
                self._update_nested(current_doc, key.split("."), value)
            else:
                if isinstance(value, MockArrayUnion):
                     if key not in current_doc:
                         current_doc[key] = []
                     for v in value.values:
                         if v not in current_doc[key]:
                             current_doc[key].append(v)
                elif isinstance(value, MockArrayRemove):
                     if key in current_doc:
                         for v in value.values:
                             if v in current_doc[key]:
                                 current_doc[key].remove(v)
                else:
                    current_doc[key] = value

    def _update_nested(self, data: Dict[str, Any], path: List[str], value: Any):
        head = path[0]
        if len(path) == 1:
            if isinstance(value, MockDeleteField) or value == DELETE_FIELD:
                if head in data:
                    del data[head]
            else:
                data[head] = value
        else:
            if head not in data:
                data[head] = {}
            self._update_nested(data[head], path[1:], value)

    def _delete_field(self, data: Dict[str, Any], key: str):
        if "." in key:
            parts = key.split(".")
            head = parts[0]
            if head in data:
                if len(parts) == 1:
                    del data[head]
                else:
                    self._delete_field(data[head], ".".join(parts[1:]))
        else:
            if key in data:
                del data[key]

    async def delete(self):
        if self.parent.name in self._db._data and self.id in self._db._data[self.parent.name]:
            del self._db._data[self.parent.name][self.id]

    async def create(self, data: Dict[str, Any]):
        if self.parent.name not in self._db._data:
            self._db._data[self.parent.name] = {}
        
        if self.id in self._db._data[self.parent.name]:
             from google.api_core.exceptions import AlreadyExists
             raise AlreadyExists(f"Document {self.id} already exists")
        
        self._db._data[self.parent.name][self.id] = data

class LocalCollectionReference:
    def __init__(self, db: 'LocalFirestoreClient', name: str):
        self.db = db
        self.name = name

    def document(self, id: str) -> LocalDocumentReference:
        return LocalDocumentReference(self, id)

    def select(self, fields: List[str]) -> 'LocalQuery':
        return LocalQuery(self)

class LocalQuery:
    def __init__(self, parent: LocalCollectionReference):
        self.parent = parent

    async def get(self) -> List[LocalDocumentSnapshot]:
        docs = []
        if self.parent.name in self.parent.db._data:
            for doc_id, data in self.parent.db._data[self.parent.name].items():
                docs.append(LocalDocumentSnapshot(doc_id, data, True))
        return docs

class LocalTransaction:
    def __init__(self, db: 'LocalFirestoreClient'):
        self.db = db

    async def get(self, ref: LocalDocumentReference) -> LocalDocumentSnapshot:
        return await ref.get()

    def update(self, ref: LocalDocumentReference, data: Dict[str, Any]):
        if ref.parent.name not in self.db._data or ref.id not in self.db._data[ref.parent.name]:
             return 
        
        current_doc = self.db._data[ref.parent.name][ref.id]
        ref._apply_update(current_doc, data)

class LocalFirestoreClient:
    def __init__(self):
        self._data: Dict[str, Dict[str, Any]] = {}

    def collection(self, name: str) -> LocalCollectionReference:
        return LocalCollectionReference(self, name)

    def transaction(self):
        return LocalTransaction(self)

