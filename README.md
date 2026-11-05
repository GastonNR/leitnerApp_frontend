# LeitnerApp — Frontend

Aplicación web para estudiar con tarjetas de memoria (flashcards) usando el **sistema Leitner**, un método de repetición espaciada que te hace repasar más seguido lo que te cuesta y menos lo que ya dominás. La API está en el [backend](https://github.com/GastonNR/leitnerApp_backend).

Hecha con React 19, Vite, React Router y Axios.

## ¿Qué es el sistema Leitner?

Es un método para memorizar con tarjetas que propuso el periodista científico alemán **Sebastian Leitner** en su libro *So lernt man lernen* (1972). Cada tarjeta tiene una pregunta de un lado y la respuesta del otro, y las tarjetas se reparten en varias **cajas**. La caja en la que está una tarjeta indica cuánto la dominás y, por lo tanto, cada cuánto hay que repasarla:

- Todas las tarjetas empiezan en la **caja 1**, que se repasa con más frecuencia.
- Si **acertás** una tarjeta, pasa a la caja siguiente, que se repasa con menos frecuencia.
- Si la **fallás**, vuelve a la caja 1, sin importar en qué caja estaba.

Con el tiempo, las tarjetas que ya sabés se acumulan en las últimas cajas y casi no te quitan tiempo. Las que te cuestan se quedan en las primeras y aparecen hasta que las aprendés.

### Por qué funciona: la repetición espaciada

En el siglo XIX, el psicólogo **Hermann Ebbinghaus** describió la **curva del olvido**: lo que aprendemos se olvida rápido al principio y más lento después. Cada vez que repasamos algo justo cuando estamos por olvidarlo, el recuerdo se refuerza y la curva se aplana, así que la siguiente vez tardamos más en olvidarlo.

De ahí sale la **repetición espaciada**: en lugar de repasar todo muchas veces seguidas (como cuando se estudia la noche anterior a un examen), conviene repasar cada cosa con intervalos cada vez más largos. Repasar algo que ya recordás perfectamente es tiempo perdido, y dejarlo demasiado tiempo obliga a aprenderlo de nuevo. El sistema Leitner es una forma simple de acercarse al momento justo para cada tarjeta.

Además, el método obliga a **recordar activamente**: antes de ver la respuesta tenés que intentar contestar de memoria. Ese esfuerzo de recuperar la información fija mucho mejor el recuerdo que volver a leerla.

### Los intervalos en LeitnerApp

Cada lección tiene **5 cajas**. Después de cada repaso, la tarjeta se programa así:

| La tarjeta queda en | Próximo repaso |
| --- | --- |
| Caja 1 (nueva o fallada) | Al día siguiente |
| Caja 2 | En 3 días |
| Caja 3 | En 7 días |
| Caja 4 | En 14 días |
| Caja 5 | En 30 días |

Una tarjeta que acertás siempre llega a la caja 5 en cuatro repasos, en algo menos de un mes. Desde ahí se repasa una vez por mes. Si en algún repaso la fallás, vuelve a la caja 1 y empieza de nuevo.

## Cómo usarla

1. **Registrate e iniciá sesión.**
2. **Creá una lección** con *+ Nueva Lección*. Cada lección es un tema distinto (por ejemplo *Inglés*, *Biología* o *Historia*) y tiene sus propias 5 cajas.
3. **Agregá tarjetas** con *Crear nueva tarjeta*: escribí la pregunta y la respuesta. Las tarjetas nuevas entran en la caja 1. Funcionan mejor las tarjetas cortas, con una sola idea cada una.
4. **Estudiá** con *Empezar*. La app te muestra solo las tarjetas que tenés que repasar hoy (si hoy no vence ninguna, te propone las de la caja 1). Intentá responder de memoria, hacé click en la tarjeta para ver la respuesta y elegí con sinceridad *Lo sabía* o *No lo sabía*.
5. **Al terminar**, la sesión se guarda sola: cada tarjeta pasa a su nueva caja con su próxima fecha de repaso.
6. **Volvé cada día.** La constancia es lo que hace funcionar el método: unos minutos diarios rinden más que una sesión larga de vez en cuando.

En la pantalla principal también podés ver las tarjetas de cada caja con *Ver tarjetas*, eliminar las que ya no necesites y consultar el **calendario**, que muestra qué cajas conviene repasar cada día de la lección.

## Requisitos

- Node.js 18 o superior
- El [backend](https://github.com/GastonNR/leitnerApp_backend) en ejecución

## Instalación

```bash
git clone git@github.com:GastonNR/leitnerApp_frontend.git
cd leitnerApp_frontend
npm install
```

Creá un archivo `.env` en la raíz con la URL de la API:

```env
VITE_API_URL="http://localhost:3000/api"
```

```bash
npm run dev
```

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve la build de producción |
| `npm run lint` | ESLint |
