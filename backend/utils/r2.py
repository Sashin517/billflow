import io
import os
import uuid
import boto3
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

R2_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "billflow-logos")
PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "").rstrip("/")

s3_client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    region_name="auto",
)


def compress_and_upload_logo(file_bytes: bytes, user_id: int) -> str:
    if not all([R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY]):
        raise RuntimeError("Missing R2 credentials in backend/.env")

    img = Image.open(io.BytesIO(file_bytes))
    img.thumbnail((800, 800))

    buffer = io.BytesIO()
    img.save(buffer, format="WEBP", quality=82, method=6)
    buffer.seek(0)

    key = f"logos/{user_id}/{uuid.uuid4().hex}.webp"
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=buffer.getvalue(),
        ContentType="image/webp",
    )
    return f"{PUBLIC_URL}/{key}"


def delete_logo_from_r2(logo_url: str | None) -> None:
    if not logo_url or not PUBLIC_URL or not logo_url.startswith(PUBLIC_URL):
        return
    key = logo_url.replace(f"{PUBLIC_URL}/", "", 1)
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=key)