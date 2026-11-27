---
title: "Attention Is All You Need: how one 2017 paper replaced recurrence"
description: The story behind the transformer, why dropping recurrence for self-attention changed NLP, and what its trade-offs mean for teams building on it.
date: 2026-11-27
tags: [AI, History, Research]
sources:
  - title: "Attention Is All You Need, Vaswani et al., arXiv"
    url: https://arxiv.org/abs/1706.03762
  - title: "Neural Machine Translation by Jointly Learning to Align and Translate, Bahdanau et al., arXiv"
    url: https://arxiv.org/abs/1409.0473
  - title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding, Devlin et al., arXiv"
    url: https://arxiv.org/abs/1810.04805
  - title: "Transformer (deep learning), Wikipedia"
    url: https://en.wikipedia.org/wiki/Transformer_(deep_learning)
aiAssisted: true
---

Much of today's generative AI, including the GPT family of language models, is built on one architecture, the transformer, and on the paper that introduced it. Knowing where it came from, and what it traded away, explains a surprising amount about how these systems behave in production.

## The story

Before 2017, the standard tools for language tasks were recurrent networks. The [transformer paper itself](https://arxiv.org/pdf/1706.03762) describes long short-term memory (LSTM) and gated recurrent networks as the established state of the art for language modelling and machine translation. A recurrent model reads a sequence one position at a time, and each hidden state is computed from the previous one. The paper points out that this sequential nature rules out parallelising the work within a single training example, which hurts most on long sequences.

There was a second problem. Early encoder–decoder translation models compressed the whole source sentence into one fixed-length vector before decoding it. In 2014, Dzmitry Bahdanau, Kyunghyun Cho and Yoshua Bengio [argued that this fixed-length vector was a bottleneck](https://arxiv.org/abs/1409.0473), and proposed allowing the model to "(soft-)search for parts of a source sentence that are relevant to predicting a target word". That paper, accepted at ICLR 2015, is an early example of attention in neural translation. But as the transformer authors noted, in all but a few cases attention was still used together with a recurrent network.

On 12 June 2017, eight researchers (Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser and Illia Polosukhin), most of them at Google Brain and Google Research, posted ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762) to arXiv. Their proposal was blunt: a network "based solely on attention mechanisms, dispensing with recurrence and convolutions entirely". The abstract reports better translation quality at a small fraction of the training cost of earlier systems: its English-to-French result came after 3.5 days of training on eight GPUs, using what the paper calls its "big" configuration. The paper appeared at NIPS 2017.

[Wikipedia's history of the transformer](https://en.wikipedia.org/wiki/Transformer_(deep_learning)) adds that Uszkoreit suspected attention without recurrence would be enough for translation, hence the title, and that the idea ran against the conventional wisdom of the time.

## Why it matters technically

The paper's case rests on three measures, set out in its Table 1. For a sequence of length n with representation size d:

- **Sequential operations.** A self-attention layer needs a constant number of them; a recurrent layer needs O(n). This is what made training parallel across the whole sequence, and so a good fit for GPUs.
- **Path length.** Any two positions are connected in a constant number of steps, rather than O(n). Shorter paths make long-range dependencies easier to learn.
- **Cost per layer.** Self-attention costs O(n² · d), against O(n · d²) for a recurrent layer. The authors note that self-attention is faster when n is smaller than d, which was usually true for the sentence-level translation work of the time.

There were costs. Averaging over attention-weighted positions blurs detail, which the authors countered with multi-head attention: eight attention heads running in parallel in the base model (the larger "big" model used 16). And because a model with no recurrence or convolution has no built-in sense of word order, they added sinusoidal positional encodings to the input embeddings, reporting that learned position embeddings gave nearly identical results.

The paper's conclusion already looked further ahead: applying the model beyond text, to images, audio and video, and restricting attention to local neighbourhoods for very long inputs. Both ideas were later taken up. Within a year and a half, [BERT](https://arxiv.org/abs/1810.04805) (Bidirectional Encoder Representations from Transformers) showed that one pre-trained transformer could be fine-tuned "with just one additional output layer" for a wide range of tasks. OpenAI's first GPT, a left-to-right transformer, dates from 2018 (the BERT paper cites it as Radford et al., 2018). According to Wikipedia, ChatGPT arrived at the end of 2022 on a fine-tuned GPT-3.5, and vision transformers now process images as sequences of patches.

## What this means for engineering teams

The original trade-offs still shape everyday work with language models:

- **Context length is not free.** The paper's own Table 1 puts self-attention at O(n² · d) per layer, and Wikipedia notes that its memory cost also grows quadratically with sequence length. Sparse attention and FlashAttention reduce the pain, but very long prompts still need more compute and memory than short ones.
- **Prefill and decode are different phases.** During generation, a model first runs a forward pass over the whole prompt, called prefilling, then produces tokens one at a time, called decoding. Key and value vectors from earlier tokens are kept in a KV cache so they are not recomputed. For anyone building a chat interface, this helps explain why the wait before the first token behaves differently from the pace of the stream that follows.
- **Stable prefixes can be reused.** Inference systems may cache the key and value states of a repeated prompt prefix, as long as the model and settings match. Putting fixed instructions first and variable content last gives that cache a chance to help.
- **Generation is still sequential.** Training became parallel; producing output did not. The paper itself named less sequential generation as a goal for future research, and streaming responses in the interface are the visible result.

## Closing thought

"Attention Is All You Need" did not invent attention. It removed the recurrent machinery around it and accepted a quadratic cost in exchange for parallel training and short paths between words. That bargain, struck for machine translation, still underpins transformer-based language models, and many of their practical limits follow directly from it.
