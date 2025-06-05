const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    month: "long",
    day: "2-digit",
  });
};


export default formatDate;