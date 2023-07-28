import json
from typing import List

from langchain.schema import (
    BaseChatMessageHistory,
)
from langchain.schema.messages import BaseMessage, _message_to_dict, messages_from_dict


class MessageSessionStorage(BaseChatMessageHistory):
    """Session-backed Entity Store."""

    def __init__(self, request):
        self.request = request
        self.key = "message_history"

    @property
    def messages(self) -> List[BaseMessage]:
        if not self.key in self.request.session:
            return []

        item: List[BaseMessage] = [json.loads(message) for message in self.request.session.get(self.key)]

        messages = messages_from_dict(item)

        return messages

    def add_message(self, message: BaseMessage) -> None:
        current = self.request.session.get(self.key, [])
        current.append(json.dumps(_message_to_dict(message)))
        self.request.session[self.key] = current
    
    def clear(self) -> None:
        if self.key in self.request.session:
            del self.request.session[self.key]









    """ def get(self, default: Optional[str] = None) -> Optional[str]:
        return self.request.session.get(self.key, default)

    def set(self, value: Optional[str]) -> None:
        self.request.session[self.key] = value
        self.request.session.save()

    def delete(self) -> None:
        if self.key in self.request.session:
            del self.request.session[self.key]
            self.request.session.save()

    def exists(self) -> bool:
        return self.key in self.request.session

    def clear(self) -> None:
        self.request.session.delete()
        self.request.session.save() 
        """
