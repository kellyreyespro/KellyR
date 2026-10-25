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

**Solo se presenta precio** si la ficha de la tienda declara precio y disponibilidad `InStock` y la verificación tiene menos de 48 h. Si no existe dato reciente confiable, no se inventan existencias y se ofrece el enlace para comprobar en el comercio. Esto no es una integración con inventario en tiempo real de todas las tiendas; para cubrir todo el catálogo se requieren feeds o API oficiales y permisos comerciales.

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
