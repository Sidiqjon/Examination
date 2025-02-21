function selfPolice(roles) {
    return (req, res, next) => {
      let { id } = req.params;
      if (id == req.user.id || roles.includes(req.user.role)) {
        next();
        return;
      }
  
      res.status(403).send({ message: "You Do Not have permission!" });
    };
  }
  
export default selfPolice;
