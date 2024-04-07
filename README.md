==========================================================================================================================
1) bootstrap: 
==========================================================================================================================
Uputstvo za preuzimanje:
	1) otvoriti u VS-Code terminal (command prompt)
	2) pozicionirati se u frontend folder
	3) izvrsiti komandu: npm install bootstrap bootstrap-icons
	4) izvrsiti komandu: npm install @types/bootstrap
	5) u frontend/angular.json fajlu izmeniti:
		* "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "styles" treba da izgleda ovako:
			"styles": [
				"node_modules/bootstrap/dist/css/bootstrap.min.css",
				"node_modules/bootstrap-icons/font/bootstrap-icons.css",
				"src/styles.css"
            ]
		* "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "scripts" treba da izgleda ovako:
			"scripts": [
				"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
==========================================================================================================================
2) Pokretanje aplikacije na localhost-u:
==========================================================================================================================
Uputstvo za pokretanje:
	1) otvoriti u VS-Code terminal (command prompt)
    	2) pozicionirati se u frontend folder (cd frontend)
        3) ponovo uci u frontend folder (cd frontend)
        4) izvrsiti komandu za pokretanje aplikacije na localhost-u (ng serve --open)
==========================================================================================================================
