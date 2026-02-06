# 🚀 Guía Paso a Paso: Publicar tu Aplicativo Web

Esta guía te llevará desde tu computadora hasta tener tu aplicativo publicado en Internet, protegido con contraseña.

## 🟢 PASO 1: Configurar la Base de Datos (Supabase)

1.  Entra a **[supabase.com](https://supabase.com/)** y crea una cuenta gratuita.
2.  Haz clic en **"New Project"**.
    *   **Name**: `dashboard-poi` (o el nombre que quieras).
    *   **Password**: Genera una segura y guárdala.
    *   **Region**: Elige una cercana (ej. East US).
3.  Una vez creado el proyecto (tarda unos minutos), ve al menú lateral izquierdo **Authentication**.
4.  Entra a **Providers** y verifica que "Email" esté habilitado.
5.  Ve a la sección **Users** (en Authentication) y haz clic en **"Invite"** o **"Add User"** para crear tu cuenta (tu correo y contraseña para entrar al dashboard).
6.  Finalmente, ve al ícono de **Settings** (engranaje ⚙️ abajo a la izquierda) > **API**.
7.  Copia estos dos valores:
    *   **Project URL**
    *   **Project API keys (anon public)**
8.  Abre el archivo `js/auth.js` en tu carpeta `POI 2026` y **pega esos valores** donde corresponde.

---

## 🟡 PASO 2: Preparar tu Código para GitHub

Como tienes este proyecto dentro de una carpeta más grande, vamos a aislarlo para subir solo esto.

1.  Abre tu terminal (PowerShell o CMD) y **navega a la carpeta del proyecto**:
    ```powershell
    cd "c:\Users\rober\OneDrive\Escritorio\APPs\POI 2026"
    ```

2.  Crea un archivo especial para ignorar archivos basura (copia y pega esto en la terminal):
    ```powershell
    echo node_modules/ > .gitignore
    echo .firebase/ >> .gitignore
    echo .ds_store >> .gitignore
    ```

3.  Inicializa el repositorio (convertir esta carpeta en un proyecto Git):
    ```powershell
    git init
    git add .
    git commit -m "Primera version del Dashboard POI"
    ```

---

## 🟠 PASO 3: Subir a GitHub

1.  Entra a **[github.com](https://github.com/)** y logueate.
2.  Haz clic en el botón **"+"** (arriba derecha) -> **New repository**.
3.  **Repository name**: `dashboard-poi` (debe ser único en tu cuenta).
4.  Asegúrate de que esté marcado como **Public**.
5.  No marques "Add a README" ni nada de eso.
6.  Haz clic en **Create repository**.
7.  Verás una pantalla con instrucciones. Copia el bloque que dice **"…or push an existing repository from the command line"**. Se verá algo así:
    ```powershell
    git remote add origin https://github.com/TU_USUARIO/dashboard-poi.git
    git branch -M main
    git push -u origin main
    ```
8.  Pega esos comandos en tu terminal (donde ejecutaste el PASO 2).

---

## 🔴 PASO 4: Activar tu Página Web

1.  En tu repositorio de GitHub, ve a la pestaña **Settings** (arriba).
2.  En el menú de la izquierda, busca la sección "Code and automation" y haz clic en **Pages**.
3.  En "Build and deployment" > **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
4.  Haz clic en **Save**.
5.  Espera unos segundos (o recarga la página). Arriba aparecerá un enlace:
    > "Your site is live at **https://tu-usuario.github.io/dashboard-poi/**"

¡Listo! Si entras a ese link, verás tu Login. Ingresa el usuario que creaste en el Paso 1 y accederás a tu Dashboard.
