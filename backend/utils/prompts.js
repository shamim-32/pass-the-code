exports.storybookPrompt = (content, opts={}) => {
  const age = opts.age || '10';
  const reading_level = opts.reading_level || 'grade5';
  return `Rewrite the following educational content into an illustrated short story suitable for a ${age}-year-old. Keep sentences short (10-15 words), use clear transitions, include simple characters and examples. Preserve the factual correctness. Content:\n${content}`;
};

exports.simplePrompt = (instruction, content) => `${instruction}: ${content}`;
