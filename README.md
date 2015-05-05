# twbs-seed
Boilerplate and custom bootstrap configuration to build faster

## HTML Template

By default, tbws-seed supports html includes. HTML files in "/src/assets/html/" will be rendered in "/src/" and their include templates should be placed in "/src/assets/html/partials/".

### Example

#### Index Page
/src/assets/html/index.html
```html
<!DOCTYPE html>
<html>
	<body>
	@@include('partials/view.html')
	@@include('partials/var.html', {
		"name": "haoxin",
		"age": 12345
	})
	</body>
</html>
```

#### Partials
/src/assets/html/partials/view.html
```html
<h1>view</h1>
```

/src/assets/html/partials/var.html
```html
<label>@@name</label>
<label>@@age</label>
```

#### Result
/src/index.html
```html
<!DOCTYPE html>
<html>
	<body>
	<h1>view</h1>
	<label>haoxin</label>
<label>12345</label>
	</body>
</html>
```

## Commands

Starts development:
```sh
gulp
```
Build
```sh
gulp build
```
