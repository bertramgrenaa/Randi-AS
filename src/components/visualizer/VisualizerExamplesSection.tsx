import { VISUALIZER_EXAMPLES } from "@/data/visualizer-examples";
import StaticBeforeAfter from "./StaticBeforeAfter";

export default function VisualizerExamplesSection() {
  return (
    <div className="rv-container rv-examples">
      <div className="rv-examples-head">
        <span className="rv-eyebrow">Eksempler</span>
        <h2>Sådan kan det se ud</h2>
        <p>
          AI-sammensatte eksempler — genereret ud fra rigtige dørfotos, ikke Randi-produktfotografi.
          Produktnummer er som oplyst ved genereringen og er ikke bekræftet mod randi.dk i denne
          prototype. Træk i &quot;viseren&quot; for at se før/efter.
        </p>
      </div>
      <div className="rv-examples-grid">
        {VISUALIZER_EXAMPLES.map((ex) => (
          <div className="rv-example-card" key={ex.id}>
            <StaticBeforeAfter
              beforeSrc={ex.beforeSrc}
              afterSrc={ex.afterSrc}
              beforeAlt={`${ex.doorLabel}, før`}
              afterAlt={`${ex.doorLabel} med Randi ${ex.productNumber}`}
              aspectRatio={ex.aspectRatio}
            />
            <div className="rv-example-caption">
              <strong>{ex.productNumber}</strong> · {ex.doorLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
