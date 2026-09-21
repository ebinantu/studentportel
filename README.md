# Student Portal

A web-based **Student Portal** developed using PHP, MySQL, HTML, CSS, and JavaScript.

> ⚠️ **IMPORTANT PROJECT NOTICE**
>
> This repository contains the completed version of the Student Portal project. However, the project files were **reorganized after development** to make the folder structure easier to understand and maintain.
>
> Because of this restructuring, **some file paths, PHP includes, JavaScript references, CSS references, and other dependencies may no longer point to their original locations**.
>
> The project should therefore be considered a **reference/archive version of the completed project**, rather than a guaranteed plug-and-play installation.

---

## ⚠️ Important Before Running

If you clone or download this project, please be aware of the following:

### 1. PHP File Paths May Need Modification

Several PHP files originally referenced files using paths based on the old project structure.

After reorganizing the folders, some paths such as:

```php
require 'connect.php';
```

or:

```php
include 'connect.php';
```

may no longer be correct.

The database connection file is now located under:

```text
backend/
└── config/
    └── connect.php
```

Therefore, some PHP files may require their `require`, `require_once`, or `include` paths to be updated.

---

### 2. JavaScript Fetch Paths May Need Modification

Some JavaScript files contain `fetch()` requests that were written for the original folder structure.

For example:

```javascript
fetch("login.php")
```

may no longer work after moving the PHP file to:

```text
backend/auth/login.php
```

Similarly, other API requests may require their paths to be updated according to the current folder structure.

The JavaScript files are mainly located under:

```text
assets/js/
```

and:

```text
assets/js/Javascript/
```

---

### 3. CSS References May Need Modification

Some HTML pages were originally designed when CSS files were located in different directories.

After restructuring the project, some:

```html
<link rel="stylesheet" href="...">
```

references may point to the old locations.

The CSS files are currently located under:

```text
assets/css/
```

and its subdirectories.

If a page appears without styling, check the CSS path in the corresponding HTML file.

---

### 4. Image, Video and Upload Paths May Need Modification

The project contains images, videos, profile pictures, certificates, documents, and other uploaded files.

These files have been reorganized into directories such as:

```text
uploads/
├── certificates/
├── documents/
├── fees/
├── profilephotos/
└── profilepics/
```

Some PHP code may still contain paths based on the original folder structure.

For example, upload-related PHP files may need their destination paths updated before the upload functionality works correctly.

---

## 🗄️ Database

The original project depends on a **MySQL database**.

The database structure is **not completely included as a ready-to-import database in this repository**.

Some SQL files are available under:

```text
webresources/
```

However, they should not be assumed to represent the complete final database.

### Important

Before running the project, **check the final database design/schema used during development**.

You need to identify:

* Required database
* Required tables
* Primary keys
* Foreign keys
* Student-related tables
* Staff-related tables
* Fee-related tables
* Attendance/registration-related data
* Request/approval-related tables
* Notification-related tables
* Any other tables referenced by the PHP code

Some PHP files may reference database tables that are **not present in the included SQL files**.

Therefore, the final database design used during development should be treated as the main reference for recreating the database.

---

## 📁 Current Project Structure

The project was reorganized into the following general structure:

```text
studentportel/
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── fonts/
│   └── videos/
│
├── backend/
│   ├── auth/
│   ├── config/
│   ├── fees/
│   ├── files/
│   ├── misc/
│   ├── notifications/
│   ├── requests/
│   ├── staff/
│   └── students/
│
├── docs/
│
├── pages/
│
├── scripts/
│
├── uploads/
│   ├── certificates/
│   ├── documents/
│   ├── fees/
│   ├── profilephotos/
│   └── profilepics/
│
├── vendor/
│
└── webresources/
```

This structure was created **after the original development was completed** to make the project easier to understand and organize.

---

## 🔧 Known Issues After Reorganization

The following areas may require manual correction:

* PHP `include` paths
* PHP `require` / `require_once` paths
* JavaScript `fetch()` URLs
* HTML → CSS references
* HTML → JavaScript references
* Image paths
* Video paths
* File upload paths
* Profile picture paths
* Certificate/document paths
* Database connection references
* Database table names
* SQL/database dependencies
* References to files that were moved or renamed
* Some source files or supporting code may be missing

These issues are mainly a consequence of **restructuring the completed project**, not necessarily problems in the original implementation.

---

## 🚧 Missing / Incomplete Files

Some files that were used during development may not be present in this repository.

Additionally, some supporting files, database scripts, references, or development files may be missing.

If a PHP file, JavaScript file, CSS file, SQL table, image, or other resource appears to be missing, refer to the **original project/development copy** where possible.

Do not assume that every dependency required by the original application is included in this repository.

---

## ▶️ Recommended Setup Process

If you want to restore and run the project:

### Step 1 — Install XAMPP

Install XAMPP with:

* Apache
* MySQL

Place the project inside:

```text
C:\xampp\htdocs\
```

For example:

```text
C:\xampp\htdocs\studentportel
```

### Step 2 — Configure the Database

Create the required MySQL database.

Then use the **final database design/schema** to create all required tables.

Do not rely only on the SQL files currently present in the repository.

### Step 3 — Check Database Connection

The database connection file is located at:

```text
backend/config/connect.php
```

Update the database credentials according to your local MySQL configuration.

### Step 4 — Check PHP Paths

Review the PHP files under:

```text
backend/
```

and verify all:

```php
include
require
require_once
```

paths.

### Step 5 — Check Frontend References

Review the HTML files under:

```text
pages/
```

and verify:

* CSS paths
* JavaScript paths
* Image paths
* Video paths

### Step 6 — Check JavaScript API Requests

Review the JavaScript files under:

```text
assets/js/
```

and verify all `fetch()` URLs point to the correct PHP endpoints.

### Step 7 — Check Upload Directories

Verify that the PHP upload scripts point to the correct directories under:

```text
uploads/
```

---

## 📌 Project Status

**Development status:** Completed

**Repository status:** Reorganized / Archived

**Runtime status after restructuring:** May require manual path and database corrections

The original project was functional during development. The current repository represents the reorganized version of that project.

---

## ⚠️ Final Warning

**Do not assume that cloning this repository and opening the project will make the application work immediately.**

The project was reorganized after completion, and this changed the locations of several files and folders.

Before attempting to run the application:

1. Check the **final database design**.
2. Create all required database tables.
3. Check PHP `include` and `require` paths.
4. Check JavaScript `fetch()` paths.
5. Check CSS and JavaScript references in HTML.
6. Check image, video, and upload paths.
7. Verify that all required supporting files are available.
8. Compare with the original development version if a dependency is missing.

This README is intended to make users aware of these limitations before they attempt to set up the project.

---

## 📄 Note

This repository is primarily intended for **project reference, documentation, academic purposes, and further development**.

If you intend to continue development, it is recommended to first restore and verify the database and then systematically validate all PHP, JavaScript, CSS, and file paths.
