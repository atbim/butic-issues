const miPrimeraFuncion = (req, res, next) => {
  try {
    const a = Number.parseInt(req.query.a)
    const b = Number.parseInt(req.query.b)
    res.json({
      status: 'success',
      message: 'Soy un método GET',
      sum: `El valor de suma es ${a + b}`,
      product: `El valor del producto es ${a * b}`,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

const miSegundaFuncion = (req, res, next) => {
  try {
    const { a, b } = req.body
    res.json({
      status: 'success',
      message: 'Soy un método POST',
      sum: `El valor de suma es ${a + b}`,
      product: `El valor del producto es ${a * b}`,
    })
  } catch (error) {
    console.error(error)
  }
}

const miTerceraFunction = (req, res, next) => {
  try {
    const id = req.params.id
    res.send(`Hola ${id} 👋`)
  } catch (error) {}
}

const miCuartaFuncion = (req, res, next) => {
  try {
    const { id } = req.params
    res.json({
      status: 'success',
      message: `Este es el estado de ${id}.`,
    })
  } catch (error) { }
}

module.exports = {
  miPrimeraFuncion,
  miSegundaFuncion,
  miTerceraFunction,
  miCuartaFuncion,
}
