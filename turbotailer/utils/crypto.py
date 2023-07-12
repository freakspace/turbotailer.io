from django.conf import settings

from cryptography.fernet import Fernet


def encrypt_message(message):
    key = settings.FERNET_KEY
    cipher_suite = Fernet(key.encode())
    cipher_text = cipher_suite.encrypt(message.encode())
    return cipher_text.decode()


def decrypt_message(cipher_text):
    key = settings.FERNET_KEY
    cipher_suite = Fernet(key.encode())
    plain_text = cipher_suite.decrypt(cipher_text.encode())
    return plain_text.decode()