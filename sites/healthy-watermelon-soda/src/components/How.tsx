import "./how.css";

export default function How() {
  return (
    <section id="how" className="how" aria-labelledby="how-title" tabIndex={-1}>
      <h2 id="how-title" className="how-title">How it was made.</h2>
      <ol className="how-list">
        <li>
          <h3>The fruit is generated.</h3>
          <p>Four stills from an image model, cut out into layers. The seeds that rise are cut from the fruit&apos;s own cut face.</p>
        </li>
        <li>
          <h3>The scroll is the knife.</h3>
          <p>One pinned scene. Your scroll moves the blade, opens the V, parts the halves and sweeps the divider away. No video, no 3D.</p>
        </li>
        <li>
          <h3>The soda is a concept.</h3>
          <p>There is no product to buy. The claim is &ldquo;no added sugar&rdquo;; the fruit still contains its natural sugars.</p>
        </li>
      </ol>
      <p className="how-credit">A portfolio concept by Goutham. Art generated, layout built by hand.</p>
    </section>
  );
}
