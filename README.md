<div align="center">

# 💜 ALÉA ✦
### Tu espacio personal de autocuidado y bienestar
**Aplicación web instalable (PWA)** · Creada por **Kelly Reyes** 🇵🇦

[![Abrir ALÉA](https://img.shields.io/badge/Abrir-AL%C3%89A-7c3aed?style=for-the-badge)](https://kellyreyespro.github.io/KellyR/alea.html)
[![Instagram](https://img.shields.io/badge/Instagram-@kellyreyes__14-4b245d?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/kellyreyes_14/)

</div>


## 💜 ALÉA · cuidado personal personalizado

La aplicación principal está en **[care.html](https://kellyreyespro.github.io/KellyR/care.html)**. Ya incluye cuestionario de piel, cabello, porosidad, frizz, sensibilidad bucal, cuidado del cuerpo, desmaquillado, presupuesto, preferencia menstrual y país. Los datos de las cuentas se conservan solo después de aplicar las nuevas tablas privadas.

**Antes de utilizar el diario con usuarias reales** ejecuta el archivo [SQL de personalización y ciclo](supabase/alea_personalizacion_y_ciclo.sql) en el SQL Editor del proyecto Supabase **de Kelly** (`iqoafinzrqnmyvaqcrqa`). No ejecutes el SQL en los proyectos de Saúl. El script crea `alea_profiles` y `alea_cycle_events` con RLS restringida al dueño de los datos. Ejecuta una sola vez y comprueba el resultado.

El ciclo se guarda solo con consentimiento: inicio del período, síntomas e intimidad opcional. El calendario es **aproximado** y no proporciona predicciones fiables de fertilidad ni sirve como anticonceptivo.

### Catálogo y actualización

ALÉA lista comercios de Panamá e identifica referencias de productos reales. Las imágenes externas son orientativas: el empaque puede variar. `scripts/actualizar_catalogo.py` revisa páginas públicas con respeto a `robots.txt`. El flujo [Verificar precios y stock](.github/workflows/alea-catalogo.yml) corre dos veces al día cuando GitHub Actions lo permita.

**Solo se presenta precio** si la ficha de la tienda declara precio y disponibilidad `InStock` y la verificación tiene menos de 24 h. Si no existe dato reciente confiable, no se inventan existencias y se ofrece el enlace para comprobar en el comercio. Esto no es una integración con inventario en tiempo real de todas las tiendas; para cubrir todo el catálogo se requieren feeds o API oficiales y permisos comerciales.

### Pruebas antes de lanzamiento

- Crear cuenta, confirmar email y cerrar/iniciar sesión con otra cuenta.
- Guardar y recuperar preferencias con `alea_profiles` y confirmar que otra cuenta no puede acceder a ellas.
- Registrar/eliminar eventos íntimos y confirmar su aislamiento mediante RLS.
- Comprobar instalación PWA desde Chrome y Safari, recarga offline y la función de catálogo.
- Confirmar un procedimiento de eliminación de cuenta, términos y política de privacidad final antes de producción.


## ✨ ¿Qué es ALÉA?

**ALÉA** es la evolución de **Mi Ritual v0.1**, una aplicación para organizar rutinas de rostro, cuerpo, cabello y bienestar. Su nueva puerta de entrada `alea.html` permite instalarla desde un navegador compatible, con icono propio y aspecto de aplicación.

## 📲 Instalar en tu dispositivo

**Android:** abre [ALÉA](https://kellyreyespro.github.io/KellyR/alea.html) en Chrome y pulsa **Instalar ALÉA** o elige «Añadir a pantalla de inicio» en el menú.

**iPhone/iPad:** abre el enlace en Safari, toca **Compartir → Añadir a pantalla de inicio**.

**Computadora:** abre el enlace desde Chrome o Edge y utiliza **Instalar** en la barra de direcciones o en el menú.

> ⚠️ Primero debes activar **GitHub Pages** en este repositorio desde **Settings → Pages**, con **Deploy from a branch → main → /(root)**. La aplicación debe abrirse por HTTPS para instalarse. El soporte depende del dispositivo/navegador.

## 🛠️ Tecnologías

HTML5 · CSS3 · JavaScript · Web App Manifest · Service Worker

## 👩‍💻 Acerca de la creadora

Soy **Kelly Reyes**, estudiante de Informática y futura desarrolladora de software en Panamá. Me interesan el desarrollo de aplicaciones, la tecnología y el análisis de datos.

🌱 **Siempre aprendiendo, siempre creando.**

📸 [Instagram: @kellyreyes_14](https://www.instagram.com/kellyreyes_14/)

## 🔐 Seguridad y limitaciones

- El archivo original `index.html` se conserva de momento, con referencias internas al nombre anterior.
- ALÉA se abre desde `alea.html`, que muestra la aplicación existente sin modificar su lógica.
- El servicio offline guarda archivos estáticos; **no garantiza que funcionen sin internet la autenticación, la sincronización o los servicios externos**.
- Antes de usar cuentas reales, configura Supabase Auth, la tabla `ritual_profiles` y políticas RLS. Nunca incluyas claves privadas en el código.
- Comprueba privacidad y consentimiento antes de guardar información personal o sensible.

## 📁 Archivos principales

| Archivo | Función |
|---|---|
| `alea.html` | Entrada de la aplicación instalable |
| `index.html` | Interfaz original de Mi Ritual |
| `manifest.webmanifest` | Nombre, icono y configuración de instalación |
| `sw.js` | Caché básica para recursos estáticos |
| `alea-icon.svg` | Icono de ALÉA |

---

<div align="center">💜 **ALÉA · Primera versión instalable**</div>


## Desarrollo e interfaz de bienestar

Ejecuta `python3 -m http.server 8000 --bind 127.0.0.1` desde la raíz y abre `care.html` en tu navegador local. No requiere instalar dependencias. La demostración funciona aunque el SDK externo de Supabase no se pueda cargar. Sus respuestas y eventos se mantienen en memoria durante la sesión y se descartan al salir; las cuentas usan las tablas privadas existentes.

La interfaz incluye inicio con registro de ánimo, cuestionario de objetivos, rutinas por categoría y calendario. El consentimiento del diario es opcional. Los recordatorios se muestran **dentro de la aplicación**; no hay notificaciones push en segundo plano. Las fechas futuras y ventanas del ciclo son aproximadas, no confirman fertilidad. Los cinco días de color a partir del inicio registrado son ilustrativos, no una duración medida. Si pasa la fecha prevista sin otro registro, se informa del desfase en lugar de reiniciar silenciosamente la cuenta.

El actualizador de catálogo comprueba las fichas individuales configuradas de Xtra y Arrocha, respeta robots.txt con timeout y admite ofertas JSON-LD de tipo Product, precio positivo, moneda USD/PAB y disponibilidad exacta InStock. Extrae la imagen del mismo producto cuando existe. Los precios desaparecen de la interfaz tras 24 horas, y el cliente vuelve a consultar el catálogo cada cinco minutos mientras está abierto. Los enlaces de las otras tiendas son puntos de consulta: **no son integraciones de inventario**. Las imágenes previas a la verificación son referencias, y no se inventan precios para completar tarjetas.

El flujo GitHub Actions existente se programa dos veces al día; debe estar habilitado y sus ejecuciones deben completarse para renovar los datos. No garantiza stock instantáneo ni stock por sucursal. Las fuentes sin acceso, sin permiso o sin datos estructurados compatibles requieren un feed/API oficial o un adaptador específico verificado antes de poder cubrir todo el catálogo. Las comprobaciones de red del entorno de desarrollo recibieron HTTP 403 del proxy; no se verificó aquí el inventario ni la web de Flo.

Validación del parser: `PYTHONPYCACHEPREFIX=/tmp/alea-pycache python3 -m unittest discover -s tests -v`. Mantén también los controles de `.github/workflows/alea-validar.yml`. Antes de publicar con cuentas reales, verifica Supabase Auth, guardado, borrado y aislamiento de datos entre dos cuentas según las pruebas descritas arriba.


## ALÉA 2.0 — experiencia renovada

- Calendario de seis semanas alineado de lunes a domingo, selección por fecha y pestañas de calendario, registros y tendencias. El color distingue sangrado anotado, duración habitual y estimación futura. La duración habitual del ciclo y del período se puede ajustar desde «Mi ritmo».
- Diario con registro de flujo, síntomas, ánimo e intimidad opcional. No se admite guardar fechas futuras. Los registros se pueden quitar por fecha y exportar desde Perfil como un archivo privado. Los intervalos del historial se muestran sin convertirlos en diagnósticos.
- Productos con fotografías grandes, ampliación, detalle, favoritos, búsqueda sin distinción de acentos, categorías, orden por precio verificado y filtro de fichas recientes. Las fotos remotas no disponibles se identifican explícitamente; las ilustraciones decorativas propias no se presentan como fotos comerciales.
- Rutinas de mañana y noche con pasos que se pueden marcar durante la sesión. No se incluye protector solar en la rutina nocturna ni desmaquillante en la matinal. Los favoritos de cuentas se guardan en las respuestas del perfil; los de demostración se descartan al salir.
- La cabecera muestra «NUEVA EXPERIENCIA · 2.0» para distinguir la versión nueva de una publicación anterior. El Service Worker usa una caché nueva e incluye los módulos, estilos e ilustraciones.

### Referencias consultadas

Se revisaron la [documentación oficial de drip](https://gitlab.com/bloodyhealth/drip), su [descripción de funciones](https://gitlab.com/bloodyhealth/drip/-/blob/main/metadata/en-US/full_description.txt) y sus [pantallas oficiales](https://gitlab.com/bloodyhealth/drip/-/tree/main/metadata/en-US/images/phoneScreenshots). Sirvieron como referencia para separar calendario, diario y tendencias y distinguir fechas registradas y previstas. ALÉA no copia su código ni usa sus capturas como recursos. Las webs de Flo y Clue recibieron denegación HTTP 403 del proxy; no se afirma haber investigado su versión actual.

### Comprobaciones de esta versión

`node --test tests/cycle.test.cjs` comprueba aritmética de fechas, años bisiestos, ciclos retrasados, requisitos de historial, ventanas estimadas y marcadores. `python3 -m unittest discover -s tests -v` comprueba el parser de ofertas.

La publicación existente del repositorio utiliza el flujo automático **pages build and deployment** de GitHub Pages. Los cambios deben llegar a `main` y ese despliegue debe finalizar; guardar archivos o publicar un snapshot del entorno no actualiza GitHub Pages. El sitio muestra una etiqueta 2.0 y utiliza una nueva versión de caché para facilitar su identificación. Comprueba el resultado del despliegue antes de afirmar que el enlace público ya se actualizó.

Prueba integral en navegador: con Playwright, Chromium y Python disponibles, ejecuta `node tests/browser.cjs` (puedes indicar `CHROMIUM_PATH`). Levanta su propio servidor local, utiliza ofertas simuladas, bloquea servicios externos y verifica recorridos a 390 y 1280 píxeles, caducidad de precios y apertura offline de la PWA. Estas pruebas no validan la base de datos remota ni el stock real.
