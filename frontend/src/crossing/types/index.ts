export type IllustrationKey = 'map' | 'coastal' | 'rocket' | 'handshake' | 'harbour' | 'tools' | 'compass' | 'anchor';

export type PanelMidProp = 'buoy' | 'rope' | 'gull' | 'dory' | 'kelp' | 'pier' | 'trap' | 'sail' | 'ripple';

export type PanelWeather =
  | 'clear-morning'
  | 'focused-overcast'
  | 'golden-hour'
  | 'lantern-dusk';

export type CardVariant = 'log' | 'workshop' | 'harbour' | 'gangway';

export type PanelSceneAccent = 'dawn-mist' | 'workshop-squall' | 'golden-harbour' | 'lantern-gangway';

export interface PanelConfig {
  id: string;
  title: string;
  logbookEntry: string;
  description: string;
  waypoint: string;
  marginNote: string;
  illustration: IllustrationKey;
  popLabel: string;
  /** Voyage chart X in 4000-wide viewBox — centers panel route sky */
  routeCenterX: number;
  /** Mid-ground prop in dead space */
  midProp: PanelMidProp;
  /** Second mid-ground prop between chart and card */
  sceneProp2: PanelMidProp;
  midPropPositions: {
    primary: string;
    secondary: string;
    tertiary?: string;
  };
  sceneProp3?: PanelMidProp;
  /** Unique atmospheric overlay — crossfades at panel boundaries */
  sceneAccent: PanelSceneAccent;
  /** Per-panel composition (chart, illustration, card placement) */
  layout: {
    chartLeft: string;
    chartRotate: string;
    illuLeft: string;
    illuBottom: string;
    illuScale: string;
    cardRight: string;
  };
  weather: PanelWeather;
  /** CSS linear-gradient weather tint over unified scene */
  bgGradient: string;
  cardVariant: CardVariant;
  parallaxBg: number;
  parallaxFg: number;
  sponsorHarbour: boolean;
  /** Hide the parchment chart inset — harbour panel uses full-column illustration */
  hideChart?: boolean;
}

export interface SponsorLogo {
  name: string;
  slug: string;
  color: string;
  pennant?: string;
  tier: 'flagship' | 'navigator' | 'crew';
}
