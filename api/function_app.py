import azure.functions as func
from azure.storage.blob import BlobServiceClient
import logging
import os

connect_str = os.environ["webappstorage_connstr"]
container_name = "files"

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="upload_file")
def upload_file(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('upload_file function processed a request.')

    try:
        file = req.files.get('file')
        if not file:
            return func.HttpResponse("No file uploaded", status_code=400)

        filename = file.filename
        blob_service = BlobServiceClient.from_connection_string(connect_str)
        blob_client = blob_service.get_blob_client(container=container_name, blob=f"{filename}.txt")

        blob_client.upload_blob(b"", overwrite=True)
        return func.HttpResponse(f"Created empty file {filename}.txt")
    except Exception as e:
        logging.error(e)
        return func.HttpResponse("Error occurred", status_code=500)
    

@app.route(route="check_file")
def check_file(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('check_file function processed a request.')

    try:
        name = req.params.get('name')
        if not name:
            return func.HttpResponse("Missing name", status_code=400)

        blob_service = BlobServiceClient.from_connection_string(connect_str)
        container_client = blob_service.get_container_client(container_name)

        exists = container_client.get_blob_client(f"{name}.txt").exists()
        return func.HttpResponse(
            body=f'{{"exists": {str(exists).lower()}}}',
            mimetype="application/json"
        )
    except Exception as e:
            logging.error(e)

            return func.HttpResponse("Error occurred", status_code=500)
