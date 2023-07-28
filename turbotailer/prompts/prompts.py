from langchain import PromptTemplate


def product_comparison_prompt(context: str, query: str):
    prompt_template = """
Use the following pieces of context to answer the question at the end. 
The context is products, and the question is most likely related to a purchase decision.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {query}
Helpful Answer:"""

    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "query"]
    )

    return prompt.format(context=context, query=query)


def product_refine_queryset(context: str, query: str):
    prompt_template = """
Use the following pieces of context to determine which is relevant to the users questions.

Context:
{context}

Question: 
{query}

Relevant context:"""

    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "query"]
    )

    return prompt.format(context=context, query=query)


template_with_history = """You are a helpful shop assistant, ready to answer any product inquries and questions from the customer. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin! Remember to speak as a helpful shop assistant when giving your final answer.

Previous conversation history:
{history}

New question: {input}
{agent_scratchpad}"""