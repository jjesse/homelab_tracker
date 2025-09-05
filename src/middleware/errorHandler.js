// Error handling middleware (ES module syntax)
// You can add more logic as needed

const errorHandler = (err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send({ error: 'Something went wrong!' });
};

export default errorHandler;
