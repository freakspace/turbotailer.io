
from typing import List

from langchain import LLMChain
from langchain.prompts import StringPromptTemplate
from langchain.chains.conversation.memory import ConversationBufferWindowMemory, ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.tools import BaseTool
from langchain.agents import LLMSingleActionAgent, AgentExecutor

from turbotailer.prompts.prompts import template_with_history
from turbotailer.prompts.tools import ProductSearch
from turbotailer.prompts.parsers import CustomOutputParser

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

    prompt = CustomPromptTemplate(
    template=template_with_history,
    tools=tools,
    input_variables=["input", "intermediate_steps", "history"]
)

    tool_names = [tool.name for tool in tools]

    output_parser = CustomOutputParser()

    llm_chain = LLMChain(llm=llm, prompt=prompt)

    agent = LLMSingleActionAgent(
        llm_chain=llm_chain, 
        output_parser=output_parser,
        stop=["\nObservation:"], 
        allowed_tools=tool_names
    )
    
    return AgentExecutor.from_agent_and_tools(
            agent=agent, 
            tools=tools, 
            verbose=True,
            memory=ConversationBufferMemory(chat_memory=memory)# ConversationBufferWindowMemory(k=2)
        )