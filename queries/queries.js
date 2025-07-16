export const signUpQuery = `
  INSERT INTO users(username, email, password) VALUES ($1,$2,$3) RETURNING *
`;

export const logInQuery = `
  SELECT * FROM users WHERE email = $1
`;
