const { google } = require("googleapis");

const {
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URL,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URL
);

// generate a url that asks permissions for Google Calendar scopes
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar",
];

const generateAuthUrl = (state?: string) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    ...(state ? { state } : {}),
  });
  return url;
};

const verifyCode = async ({ code }: { code: string }) => {
  const { tokens } = await oauth2Client.getToken(code);
  await oauth2Client.setCredentials(tokens);
  return tokens;
};

const getAuth = (access_token?: string) => {
  const newClient = new google.auth.OAuth2(
    GOOGLE_APP_CLIENT_ID,
    GOOGLE_APP_CLIENT_SECRET,
    GOOGLE_APP_REDIRECT_URL
  );
  newClient.setCredentials({ access_token });
  return newClient;
};

const getUserProfile = async () => {
  const newClient = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  const response = await newClient.userinfo.get();
  return response.data;
};

export { generateAuthUrl, verifyCode, getUserProfile, getAuth };
