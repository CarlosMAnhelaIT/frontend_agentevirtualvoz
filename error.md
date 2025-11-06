
2025-11-05T12:02:33.201Z
INIT_START Runtime Version: python:3.11.v101 Runtime Version ARN: arn:aws:lambda:eu-west-1::runtime:8ffbe4fa8da2edc85690a225a5a6241ec6325c93147eb87a2a04bf62cf3637a9
2025-11-05T12:02:34.230Z
START RequestId: 432a7912-f988-4f51-860b-45f2f5b886a4 Version: $LATEST
2025-11-05T12:02:34.926Z
Error consultando a Pinecone: HTTP Error 401: Unauthorized
2025-11-05T12:02:36.069Z
Respuesta de Gemini: ```json
2025-11-05T12:02:36.069Z
{
2025-11-05T12:02:36.069Z
"sentiment": "Neutral",
2025-11-05T12:02:36.069Z
"responseText": "¡Hola Jaime! Encantado de saludarte. Soy tu asistente virtual de Lyntia y estoy aquí para ayudarte con cualquier duda o problema técnico que tengas. ¿En qué puedo ayudarte hoy?"
2025-11-05T12:02:36.069Z
}
2025-11-05T12:02:36.069Z
```
2025-11-05T12:02:36.880Z
Error en el handler: unhashable type: 'dict'
2025-11-05T12:02:36.882Z
[ERROR] TypeError: unhashable type: 'dict' Traceback (most recent call last):   File "/var/task/lambda_function.py", line 250, in lambda_handler     'headers': {{'Content-Type': 'application/json'}},
2025-11-05T12:02:36.884Z
END RequestId: 432a7912-f988-4f51-860b-45f2f5b886a4
2025-11-05T12:02:36.884Z
REPORT RequestId: 432a7912-f988-4f51-860b-45f2f5b886a4 Duration: 2653.30 ms Billed Duration: 3680 ms Memory Size: 512 MB Max Memory Used: 84 MB Init Duration: 1026.19 ms