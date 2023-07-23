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