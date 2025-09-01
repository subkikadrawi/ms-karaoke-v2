function genereateValidationID(): string {
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');

  const randomNumber = Math.floor(100 + Math.random() * 900);
  const randomChars = Array.from({length: 7}, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  ).join('');

  return `REQ-${formattedDate}-${randomNumber}-${randomChars}`;
}

export {genereateValidationID};
