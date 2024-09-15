# GameDevs grupp 5

## För att starta backend:
1. Se till att ha mongodb installerat
2. Se till så du har java version 17 eller senare
3. Ladda ner projektet
4. Öppna i VSC
5. Ta  bort spring.data.mongodb.uri= ${URI} i application.properties
6. Du kan övervaka databasen med Studio3T eller MongodbCompass
7. Starta projektet

## För att starta frontend:
1. Se till att ha node.js installerat
2. Ladda ner projektet
3. Se till att backend delen är igång
4. Öppna i VSC
5. Kör kommando i terminalen "npm install" för att installera dependencies
6. Kör kommando i terminalen "npm run dev" för att starta applikationen
7. Öppna applikationen, du får fram en port (brukar vara "http://localhost:5173/")

## I applikationen så kan du:
1. Registrera och logga in användare
2. Logga ut
3. Överblick över spelregler
4. Lägga in egna ord i spelet
5. Se lobby med aktiva spel och chatt
6. Skapa spelrum
7. Ta bort dina skapade spelrum
8. Starta spel
9. Se top-5 spelares resultat (antal vinster)

## Spelet:
Tryck spela för att se aktiva spelrum eller skapa ditt eget.
Den som är först i spelrummet kommer få rollen "painter".
Den som är painter kommer se ett ord på skärmen som den ska rita.
Resten av deltagarna ska i chatten gissa vad det är som ritas.
Vid rätt gissning tilldelas poäng till både painter och guesser.
Deltagaren som når 25 poäng först vinner!

Vi har även deployat spelet för den som är sugen på att bara dyka in och testa: https://urchin-app-dd7xw.ondigitalocean.app/?page=start

Detta är ett spel skapat av Grupp 5: Eric Ö, Dennis, Marcus N och Love för uppgiften GameDevs!
