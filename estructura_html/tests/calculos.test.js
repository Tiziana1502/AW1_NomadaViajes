// PRUEBAS UNITARIAS con el corredor de pruebas nativo de Node.js
// Se ejecutan con: node --test  (desde la carpeta estructura_html)
// No hace falta instalar nada: node:test y node:assert vienen con Node.js
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { calcularPrecioTotal, validarDni } from "../src/recursos/js/calculos.js"

describe("calcularPrecioTotal", () => {
    // Casos válidos
    it("multiplica el precio por la cantidad de personas", () => {
        assert.strictEqual(calcularPrecioTotal(420000, 2), 840000)
    })

    it("acepta los límites de 1 y 10 personas", () => {
        assert.strictEqual(calcularPrecioTotal(150000, 1), 150000)
        assert.strictEqual(calcularPrecioTotal(150000, 10), 1500000)
    })

    // Casos de error
    it("rechaza 0 personas y más de 10", () => {
        assert.throws(() => calcularPrecioTotal(420000, 0), RangeError)
        assert.throws(() => calcularPrecioTotal(420000, 11), RangeError)
    })

    it("rechaza personas con decimales o escritas como texto", () => {
        assert.throws(() => calcularPrecioTotal(420000, 2.5), TypeError)
        assert.throws(() => calcularPrecioTotal(420000, "2"), TypeError)
    })

    it("rechaza un precio negativo, en cero o que no es número", () => {
        assert.throws(() => calcularPrecioTotal(-1000, 2), TypeError)
        assert.throws(() => calcularPrecioTotal(0, 2), TypeError)
        assert.throws(() => calcularPrecioTotal("420000", 2), TypeError)
    })
})

describe("validarDni", () => {
    // Casos válidos: devuelve "" (sin error)
    it("acepta un DNI de 8 números", () => {
        assert.strictEqual(validarDni("40123456"), "")
    })

    it("acepta un DNI de 7 números y con puntos", () => {
        assert.strictEqual(validarDni("9876543"), "")
        assert.strictEqual(validarDni("40.123.456"), "")
    })

    // Casos de error: devuelve el mensaje que ve el usuario
    it("pide el DNI si el campo está vacío", () => {
        assert.strictEqual(validarDni(""), "Ingresá tu DNI.")
        assert.strictEqual(validarDni("   "), "Ingresá tu DNI.")
    })

    it("rechaza letras y largos incorrectos", () => {
        const mensaje = "El DNI debe tener 7 u 8 números, sin letras."
        assert.strictEqual(validarDni("4012345A"), mensaje)
        assert.strictEqual(validarDni("123456"), mensaje)
        assert.strictEqual(validarDni("123456789"), mensaje)
    })
})
