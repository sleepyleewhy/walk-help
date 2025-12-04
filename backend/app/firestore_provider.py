import os
import logging
from typing import Any, Callable, TypeVar

logger = logging.getLogger(__name__)

USE_LOCAL_FIRESTORE = os.getenv("USE_LOCAL_FIRESTORE", "false").lower() == "true"

# Define generic types for the mock
T = TypeVar("T")

if USE_LOCAL_FIRESTORE:
    logger.info("Using Local Firestore implementation")
    from .local_firestore import (
        LocalFirestoreClient, 
        LocalTransaction, 
        MockArrayUnion, 
        MockArrayRemove, 
        DELETE_FIELD
    )

    ArrayUnion = MockArrayUnion
    ArrayRemove = MockArrayRemove
    
    AsyncClient = LocalFirestoreClient
    AsyncTransaction = LocalTransaction

    def async_transactional(func: Callable[..., Any]) -> Callable[..., Any]:
        async def wrapper(transaction, *args, **kwargs):
            return await func(transaction, *args, **kwargs)
        return wrapper

else:
    try:
        from google.cloud.firestore_v1 import (
            AsyncClient,
            AsyncTransaction,
            async_transactional,
            ArrayUnion,
            ArrayRemove,
            DELETE_FIELD
        )
    except ImportError:
        logger.warning("google-cloud-firestore not found, falling back to local mock but USE_LOCAL_FIRESTORE is not set.")
        raise ImportError("google-cloud-firestore is not installed. Install it or set USE_LOCAL_FIRESTORE=true")

def get_firestore_client() -> Any:
    if USE_LOCAL_FIRESTORE:
        return LocalFirestoreClient()
    else:
        return AsyncClient(database="walkaware-db")
