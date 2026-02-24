import logging
import os
import random
import socket
import threading
import time


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

DEFAULT_PORTS = "21,2121,2323,5001,64000"
FTP_PORT = int(os.getenv("FAKE_FTP_PORT", "21"))
PORTS = {
    int(port.strip())
    for port in os.getenv("DECOY_PORTS", DEFAULT_PORTS).split(",")
    if port.strip()
}
PORTS.add(FTP_PORT)

FTP_BANNER = [
    "220 (FakeFTPd 0.0.1) ready\r\n",
    "331 Please specify the password.\r\n",
]

GENERIC_RESPONSES = [
    "Hello adventurer, nothing to see here.\n",
    "System busy, try again later.\n",
    "Unhandled command received.\n",
]


def handle_connection(conn: socket.socket, addr, port: int) -> None:
    """Send intentionally unhelpful responses to connections."""
    conn.settimeout(5)
    peer = f"{addr[0]}:{addr[1]}"
    logging.info("Connection from %s on port %s", peer, port)
    try:
        if port == FTP_PORT:
            for line in FTP_BANNER:
                conn.sendall(line.encode("ascii"))
            try:
                _ = conn.recv(1024)
