export function selfPolice(req, res, next) {
    console.log(`Method: ${req.method}, URL: ${req.url}, Time: ${new Date().toISOString()}`);
    next();
  }
  