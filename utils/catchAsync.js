module.exports = (func) => {
  console.log("abc");
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
