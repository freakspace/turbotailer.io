
from typing import List

from langchain.prompts import StringPromptTemplate
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.tools import BaseTool
from langchain.agents import initialize_agent
from langchain.agents import AgentType

from turbotailer.prompts.tools import ProductSearch

# Set up a prompt template
class CustomPromptTemplate(StringPromptTemplate):
    # The template to use
    template: str
    # The list of tools available
    tools: List[BaseTool]
    
    def format(self, **kwargs) -> str:
        # Get the intermediate steps (AgentAction, Observation tuples)
        # Format them in a particular way
        intermediate_steps = kwargs.pop("intermediate_steps")
        thoughts = ""
        for action, observation in intermediate_steps:
            thoughts += action.log
            thoughts += f"\nObservation: {observation}\nThought: "
        # Set the agent_scratchpad variable to that value
        kwargs["agent_scratchpad"] = thoughts
        # Create a tools variable from the list of tools provided
        kwargs["tools"] = "\n".join([f"{tool.name}: {tool.description}" for tool in self.tools])
        # Create a list of tool names for the tools provided
        kwargs["tool_names"] = ", ".join([tool.name for tool in self.tools])
        return self.template.format(**kwargs)

def get_agent(llm, namespace, memory):

    tools = [
        ProductSearch(namespace=namespace, llm=llm)
        ]
    
    agent_chain = initialize_agent(
        tools, 
        llm, 
        agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION, 
        verbose=True, 
        memory=ConversationBufferMemory(
            memory_key="chat_history", 
            return_messages=True,
            chat_memory=memory
            )
        )

    return agent_chain