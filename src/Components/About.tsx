function About() {
  return (
    <div>
      <h3>Om spelet</h3>
      <ol>
        <li>Tryck spela för att se aktiva spelrum eller skapa ditt eget.</li>
        <li>Den som är först i spelrummet kommer få rollen "painter".</li>
        <li>
          Den som är painter kommer se ett ord på skärmen som den ska rita.
        </li>
        <li>Resten av deltagarna ska i chatten gissa vad det är som ritas.</li>
        <li>
          Vid rätt gissning tilldelas poäng till både painter och guesser.
        </li>
        <li>Deltagaren som når 25 poäng först vinner!</li>
      </ol>
    </div>
  );
}

export default About;
