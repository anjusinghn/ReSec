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
