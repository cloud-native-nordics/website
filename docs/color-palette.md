# Cloud Native Nordics — Color Palette

## Design Rationale

The palette bridges two worlds: the **Kubernetes blue** (`#326CE5`) from the logo and the **warm Scandinavian tones** of Nordic interiors — think birch wood, amber light through winter windows, muted terracotta, and fjord-grey stone. The result is a tech community site that feels distinctly Nordic rather than generic Silicon Valley.

## The Palette

### Primary — Logo Blue
| Name | Hex | Usage |
|------|-----|-------|
| **Fjord Blue** | `#326CE5` | Logo, primary actions, links. The anchor color. |
| **Fjord Light** | `#5B8DEF` | Blue hover states, light accents |

### Warm Accents — The Nordic Hearth
| Name | Hex | Usage |
|------|-----|-------|
| **Amber** | `#E8A435` | Primary warm accent. CTAs, highlights, icon color. Warm amber like candlelight. |
| **Ember** | `#D4763A` | Secondary warm accent. Gradient endpoint, hover states. Muted burnt orange. |

### Neutrals — Birch & Stone
| Name | Hex | Usage |
|------|-----|-------|
| **Birch** | `#F5EDE3` | Light mode page background. Warm off-white like birch wood. |
| **Wool** | `#E8DED1` | Light mode card/section alternate. Like natural wool. |
| **Stone** | `#9C9489` | Secondary text (light mode). Warm grey like Nordic granite. |
| **Slate** | `#5C564E` | Primary text (light mode). Warm dark grey. |

### Dark Mode — Winter Night
| Name | Hex | Usage |
|------|-----|-------|
| **Night** | `#0C0A09` | Dark mode page background. Near-black with warm undertone. |
| **Charcoal** | `#1C1917` | Dark mode cards/surfaces. Warm dark grey (stone-950). |
| **Ash** | `#A8A29E` | Secondary text (dark mode). Warm medium grey. |

### Gradient
Primary accent: `linear-gradient(135deg, #E8A435, #D4763A)` — amber to ember, like a Nordic sunset.

## Comparison with Current

| Current | New | Why |
|---------|-----|-----|
| `#FF6DAF` (pink) | `#E8A435` (amber) | More Scandinavian, complements blue better |
| `#FFB500` (gold) | `#D4763A` (ember) | Warmer, more natural, less "tech startup" |
| `#FDF9F9` (warm white) | `#F5EDE3` (birch) | Warmer, more character, distinctly Nordic |
| `#09090b` (zinc black) | `#0C0A09` (night) | Same depth, slight warm shift |
| `#18181b` (zinc dark) | `#1C1917` (charcoal) | Warm undertone matches palette |
| `#F11F7E` (hotpink) | removed | Replaced by amber/ember gradient |

## Usage Examples

- **Stats bar gradient**: amber → ember
- **Hero aurora blobs**: amber, ember, fjord blue
- **Spinning rings**: amber, ember, blue
- **Member badges**: amber → ember gradient with white text
- **Card hover**: amber border
- **Section headings**: amber accent
- **CFP/About sections**: amber → ember gradient background
- **Focus rings**: amber
- **Links**: fjord blue, hover ember
