from __future__ import annotations

import asyncio
import base64
import os
import re
import time
import uuid
from typing import Optional
import logging

logger = logging.getLogger(__name__)

USE_LOCAL_STORAGE = os.getenv("USE_LOCAL_STORAGE", "false").lower() == "true"
LOCAL_STORAGE_DIR = os.getenv("LOCAL_STORAGE_DIR", "local_storage")

GCS_BUCKET = os.getenv("GCS_BUCKET", "")
GCS_CROSSWALK_PREFIX = os.getenv("GCS_CROSSWALK_PREFIX", "crosswalk/")
GCS_NO_CROSSWALK_PREFIX = os.getenv("GCS_NO_CROSSWALK_PREFIX", "no_crosswalk/")

_DATA_URL_RE = re.compile(r"^data:(?P<mime>[^;]+);base64,(?P<data>.+)$")


def _parse_data_url(data_url: str) -> tuple[bytes, str, str]:
    match = _DATA_URL_RE.match(data_url)
    if match:
        mime = match.group("mime")
        b64 = match.group("data")
    else:
        try:
            b64 = data_url.split(",", 1)[1]
        except Exception:
            b64 = data_url
        mime = "image/jpeg"

    try:
        raw = base64.b64decode(b64, validate=True)
    except Exception:
        raw = base64.b64decode(b64)

    if "/png" in mime:
        ext = "png"
    elif "/webp" in mime:
        ext = "webp"
    elif "/gif" in mime:
        ext = "gif"
    else:
        mime = "image/jpeg"
        ext = "jpg"

    return raw, mime, ext


def _upload_bytes(raw: bytes, mime_type: str, is_crosswalk: bool) -> Optional[str]:
    if USE_LOCAL_STORAGE:
        return _upload_local(raw, mime_type, is_crosswalk)
    else:
        return _upload_gcs(raw, mime_type, is_crosswalk)


def _upload_local(raw: bytes, mime_type: str, is_crosswalk: bool) -> Optional[str]:
    try:
        if not os.path.exists(LOCAL_STORAGE_DIR):
            os.makedirs(LOCAL_STORAGE_DIR)
        
        prefix = "crosswalk" if is_crosswalk else "no_crosswalk"
        directory = os.path.join(LOCAL_STORAGE_DIR, prefix)
        if not os.path.exists(directory):
            os.makedirs(directory)

        if "/png" in mime_type:
            ext = "png"
        elif "/webp" in mime_type:
            ext = "webp"
        elif "/gif" in mime_type:
            ext = "gif"
        else:
            ext = "jpg"

        filename = f"{int(time.time()*1000)}_{uuid.uuid4()}.{ext}"
        filepath = os.path.join(directory, filename)
        
        with open(filepath, "wb") as f:
            f.write(raw)
            
        uri = f"file://{os.path.abspath(filepath)}"
        logger.info("Saved image locally to %s", uri)
        return uri
    except Exception:
        logger.exception("Failed to save image locally")
        return None


def _upload_gcs(raw: bytes, mime_type: str, is_crosswalk: bool) -> Optional[str]:
    try:
        from google.cloud import storage
        if not GCS_BUCKET:
            logger.warning("GCS upload skipped: GCS_BUCKET env var is not set")
            return None
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET)
        prefix = GCS_CROSSWALK_PREFIX if is_crosswalk else GCS_NO_CROSSWALK_PREFIX
        # Normalize extension based on mime type (prefer jpg for JPEGs)
        if "/png" in mime_type:
            ext = "png"
        elif "/webp" in mime_type:
            ext = "webp"
        elif "/gif" in mime_type:
            ext = "gif"
        else:
            ext = "jpg"

        object_name = f"{prefix}{int(time.time()*1000)}_{uuid.uuid4()}.{ext}"
        blob = bucket.blob(object_name)
        blob.upload_from_string(raw, content_type=mime_type)
        gs_uri = f"gs://{GCS_BUCKET}/{object_name}"
        logger.info("Uploaded image to %s", gs_uri)
        return gs_uri
    except ImportError:
        logger.error("google-cloud-storage not installed")
        return None
    except Exception:
        logger.exception("Failed to upload image to GCS")
        return None


async def async_upload_image_base64_to_gcs(data_url: str, is_crosswalk: bool) -> Optional[str]:
    raw, mime, _ = _parse_data_url(data_url)
    return await asyncio.to_thread(_upload_bytes, raw, mime, is_crosswalk)
