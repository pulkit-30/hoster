const generateUrl = (id: string) => {
  return {
    api: `${process.env.PUBLIC_API_URL}/v1/api/user/${id}/calender/`,
    frontend: `${process.env.PUBLIC_FRONTEND_URL}/user/${id}/calender/`,
  };
};
export default generateUrl;
