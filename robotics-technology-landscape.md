# The Robotics Technology Landscape

### A Reference Primer for Industry Analysis — Robot Types, Enabling Technologies, and Their Trade-offs

**Prepared for:** Summit Research — Robotics Industry Working Group
**Purpose:** Establish a shared, standards-based vocabulary and technology map so analysts can conduct detailed technology due diligence *before* moving into industry structure, competitive, and valuation analysis.
**Status:** Foundational reference — v1.0
**Last updated:** July 2026

---

## 0. How to use this document

This is not an investment thesis. It is a **technology-first reference** that answers three questions for every major robot category and enabling technology:

1. **What is it?** — a precise, standards-based definition.
2. **What is it good and bad at?** — honest pros and cons.
3. **What does it do best?** — the functionalities it targets and the use cases where it wins.

The goal is that every analyst starts from the *same taxonomy* and the *same definitions* so that subsequent work (market sizing, value-chain mapping, competitive positioning, and company-level analysis) is built on common ground.

**Reading path:**
- **Part 1** sets the official classification framework (the "map of the map").
- **Parts 2–4** go layer by layer: industrial robots, mobile/service robots, and the cross-cutting enabling technologies (perception, actuation, intelligence).
- **Part 5** is an application matrix — *which robot for which job*.
- **Part 6** is a decision guide and glossary.

---

## 1. The classification framework (why we anchor to IFR & ISO)

To avoid ad-hoc categories, this document anchors to the two most authoritative sources in the field:

- **ISO 8373:2021 — *Robotics — Vocabulary*** — the international standard (maintained by ISO Technical Committee TC 299, "Robotics") that defines the fundamental terms: *robot*, *industrial robot*, *service robot*, *medical robot*, *autonomy*, and *robotic technology*. The 2021 third edition added terms such as *medical robot* and *wearable robot* to reflect the state of the art. [1][2]
- **International Federation of Robotics (IFR) — *World Robotics* yearbooks** — the industry-standard statistical source, which explicitly uses ISO 8373 definitions and publishes the annual counts of installed robots worldwide. [3][4]

### 1.1 The top-level partition (per ISO 8373 / IFR World Robotics)

The World Robotics 2025 yearbook classifies robots into **three top-level categories**: [4][5]

| Category | ISO 8373 basis | Plain-language definition |
|---|---|---|
| **Industrial robots** | "An automatically controlled, reprogrammable, multipurpose **manipulator**, programmable in three or more axes, which can be either fixed in place or mobile, for use in industrial automation applications." | Robots that manipulate things in a factory/industrial setting. |
| **Service robots** | "A robot in personal use or professional use that performs useful tasks for humans or equipment." | Robots that perform tasks *outside* industrial automation — split into **professional** (logistics, agriculture, inspection, hospitality) and **personal/consumer** (vacuums, lawn mowers, home assistants). |
| **Medical robots** | Treated as a distinct category alongside the two above in World Robotics 2025. | Surgical, rehabilitation, and hospital-logistics robots (regulated as medical devices). |

> **Key definitional insight:** The dividing line is **not** the robot's shape — it is its **application context**. The *same* articulated arm can be an "industrial robot" on a car line or a "service robot" if it plates food in a restaurant. This matters for market sizing: IFR counts them in different buckets. [3]

### 1.2 The two useful cross-cuts

Because the ISO/IFR partition is by *use*, analysts need two additional lenses that cut across it:

- **By mechanical structure** (how the body is built) — IFR identifies **six** industrial-robot structures based on mechanical topology. Covered in Part 2. [3][6]
- **By locomotion / mobility** (fixed vs. mobile; wheeled, legged, aerial, aquatic) — the most useful lens for service and next-generation robots. Covered in Part 3.

We use all three lenses in this document because no single one is sufficient.

---

## 2. Industrial robots — classified by mechanical structure (the IFR six)

IFR/ISO classify industrial robots into six structures based on mechanical topology. Below, each includes its degrees of freedom (DoF / axes), strengths, weaknesses, and where it wins. [6]

### 2.1 Articulated robots
- **What it is:** The classic "robot arm" with rotary joints (typically **6 axes**, sometimes 7). The most common industrial robot type by installed base. [3][6]
- **Functionality focus:** General-purpose manipulation — reach around obstacles, approach from many angles.
- **Pros:** Largest work envelope relative to footprint; highest flexibility; can reach over/around parts; huge ecosystem and installed base.
- **Cons:** More complex control; generally slower and less precise than SCARA/parallel for simple planar tasks; higher cost per axis.
- **Best for:** Welding, painting, assembly, machine tending, material handling, palletizing.
- **Primary sectors:** Automotive (dominant), general manufacturing, metals, aerospace.

### 2.2 SCARA robots
- **What it is:** *Selective Compliance Assembly Robot Arm* — **4 axes**, rigid vertically but compliant horizontally.
- **Functionality focus:** Fast, precise **pick-and-place** and vertical insertion on a plane.
- **Pros:** Very fast and repeatable for planar tasks; rigid in Z; lower cost than 6-axis for the same duty.
- **Cons:** Limited to mostly flat/planar work; small vertical range; cannot reach around obstacles.
- **Best for:** Electronics assembly, small-parts pick-and-place, packaging, dispensing.
- **Primary sectors:** Electronics/semiconductors, consumer goods, pharma packaging.

### 2.3 Cartesian / gantry robots
- **What it is:** Linear robots moving on **3 perpendicular axes (X, Y, Z)**; large ones are "gantry" robots.
- **Functionality focus:** High-precision linear motion over a defined rectangular volume; heavy payloads.
- **Pros:** Very high precision and stiffness; simple, predictable motion; can be scaled to very large work areas and heavy loads.
- **Cons:** Large footprint relative to work envelope; limited flexibility (no dexterous approach angles); can be slower.
- **Best for:** CNC/3D-printing, large-part handling, pick-and-place over big areas, palletizing.
- **Primary sectors:** Logistics/warehousing, heavy manufacturing, additive manufacturing.

### 2.4 Parallel / delta robots
- **What it is:** Multiple arms connected to a common platform ("spider" configuration), usually **3–4 axes**, mounted overhead.
- **Functionality focus:** Extremely **high-speed, lightweight** pick-and-place.
- **Pros:** Fastest cycle times of any type; high precision for light loads; low moving mass.
- **Cons:** Small work envelope; low payload; limited to light objects; complex kinematics.
- **Best for:** High-speed sorting, packaging, food handling.
- **Primary sectors:** Food & beverage, pharma, consumer packaging.

### 2.5 Cylindrical robots
- **What it is:** An arm operating within a cylindrical coordinate space (rotary base + linear vertical + linear reach).
- **Functionality focus:** Simple, compact assembly and machine tending in a cylindrical envelope.
- **Pros:** Compact; simple; good for tight spaces and vertical assembly.
- **Cons:** Limited reach and flexibility; declining share as articulated/SCARA displace them.
- **Best for:** Machine tending, spot welding, simple assembly.
- **Primary sectors:** Legacy manufacturing niches.

### 2.6 "Others" (incl. spherical/polar and specialized structures)
- IFR keeps a residual category for structures that don't fit the above (e.g., polar/spherical arms and specialized mechanisms). Small and shrinking share. [6]

### 2.7 The important cross-cutting class: Collaborative robots ("cobots")
> **Note:** *Collaborative* is a **functional/safety** classification, **not** a mechanical structure — most cobots are articulated arms. IFR tracks them separately because of their distinct use profile. [3]

- **What it is:** Robots designed to work **safely alongside humans** without safety cages, using force/torque limiting and sensing.
- **Pros:** Fast to deploy; flexible; safe near people; lower integration cost; ideal for high-mix/low-volume.
- **Cons:** Slower and lower payload than caged industrial robots (safety limits speed/force); still a **minority of total installations** despite fast growth.
- **Best for:** Small/medium manufacturers, high-mix assembly, machine tending, lab automation.
- **Leaders to note:** Universal Robots (Teradyne), FANUC, plus a large field of entrants.

---

## 3. Mobile & service robots — classified by locomotion and form

Where industrial robots are usually *fixed manipulators*, the fastest-growing frontier is **mobile** robots. IFR's service-robot category grew strongly, with professional service robots reaching ~200,000 units sold in 2024. [4] Here we classify by *how they move*.

### 3.1 Wheeled ground robots: AGVs vs AMRs
This distinction is critical and frequently confused.

| | **AGV** (Automated Guided Vehicle) | **AMR** (Autonomous Mobile Robot) |
|---|---|---|
| **Navigation** | Follows fixed infrastructure (magnetic tape, wires, markers) | Navigates freely using onboard sensing + SLAM |
| **Flexibility** | Low — reroute requires re-laying guides | High — reroutes in software |
| **Cost** | Lower unit cost, higher infra cost | Higher unit cost, lower infra cost |
| **Best for** | Fixed, repetitive routes in stable layouts | Dynamic environments, changing routes |

- **Pros (wheeled generally):** Energy-efficient, fast, simple, mature, cheap on flat floors.
- **Cons:** Restricted to relatively flat, hard surfaces; cannot climb stairs or handle rough terrain.
- **Primary sectors:** Warehousing/logistics, e-commerce fulfillment, manufacturing intralogistics, hospitals.
- **Players to note:** Amazon Robotics, Locus Robotics, Geek+, Zebra/Fetch.

### 3.2 Legged robots
Locomotion via legs — trades efficiency for the ability to traverse human/natural environments.

**a) Quadrupeds (four legs)**
- **Pros:** Excellent stability on rough/uneven terrain; can climb stairs; recover from pushes.
- **Cons:** Expensive; energy-hungry; limited payload; complex control.
- **Best for:** Industrial inspection, security patrol, mapping hazardous sites.
- **Players:** Boston Dynamics (Spot), Unitree, ANYbotics, DEEP Robotics.

**b) Humanoids / bipeds (two legs, human form)**
- **Why the form matters:** Designed to operate in **environments and with tools built for humans** — no need to re-engineer factories or homes.
- **Pros:** Maximum versatility in human spaces; can (in principle) do any human manual task; general-purpose.
- **Cons:** Hardest locomotion problem (dynamic balance); most expensive; energy-intensive; early-stage reliability; safety near people unproven at scale.
- **Best for (today):** Structured logistics/manufacturing pilots; the long-term bet is general-purpose labor.
- **Players:** Figure AI, Tesla (Optimus), Agility Robotics (Digit), Apptronik, 1X, Boston Dynamics (Atlas); China: Unitree, UBTECH, AgiBot, Fourier. [7]

### 3.3 Aerial robots (drones / UAVs)
- **Pros:** Access from above; cover large areas fast; no ground obstacles; cheap per area surveyed.
- **Cons:** Limited flight time/payload (battery); weather-sensitive; regulated airspace.
- **Best for:** Inspection (infrastructure, energy), agriculture (spraying, mapping), surveying, delivery, defense.
- **Primary sectors:** Agriculture, energy/utilities, construction, logistics, defense.

### 3.4 Aquatic / underwater robots (AUV / ROV)
- **AUV** = autonomous underwater vehicle; **ROV** = remotely operated vehicle (tethered).
- **Pros:** Access to environments unsafe/impossible for humans; long endurance (AUV).
- **Cons:** Communication is hard underwater (no GPS/radio); expensive; slow.
- **Best for:** Offshore energy inspection, subsea cables/pipelines, hydrography, defense, research.

### 3.5 Personal / consumer service robots
- **What it is:** Robots sold to consumers for domestic tasks.
- **Examples:** Robot vacuums/mowers (the highest-volume consumer category by far), pool cleaners, education/companion robots.
- **Pros:** Massive unit volumes; low price points; proven consumer willingness to pay.
- **Cons:** Narrow single-purpose functionality; thin margins; commoditized.
- **Players:** iRobot, Ecovacs, Roborock, plus lawn/pool niche players.

### 3.6 Medical robots (regulated third category)
- **Surgical robots:** Teleoperated precision manipulators (e.g., Intuitive Surgical's da Vinci). High precision, minimally invasive; very high cost; long regulatory cycles.
- **Rehabilitation & exoskeletons (wearable robots):** Assist or restore human movement; ISO added "wearable robot" in 2021. [2]
- **Hospital logistics robots:** Autonomous delivery of supplies/meds within facilities.
- **Best for:** High-value, precision-critical, safety-regulated healthcare tasks.

---

## 4. The cross-cutting enabling technologies (the layers inside every robot)

Every robot — regardless of category — is built from the same three technology layers. **This is where much of the investable "picks-and-shovels" value sits**, because these components sell to *all* robot makers.

### 4.1 Perception ("how robots see and sense")
The sensing stack that lets a robot understand its environment. Modern robots use **sensor fusion** (combining several).

| Technology | How it works | Pros | Cons | Best for |
|---|---|---|---|---|
| **RGB cameras (2D vision)** | Standard image + AI recognition | Cheap, rich detail, mature AI | No native distance; poor in low light | Object recognition, inspection |
| **Stereo cameras** | Two lenses → depth from disparity | Depth + color, passive | Fails on textureless surfaces/dark | Navigation, legged robots |
| **Depth cameras (RGB-D)** | RGB + structured light or time-of-flight | Accurate short-range depth + recognition | Short range; degrades in sunlight | Grasping, pick-and-place, indoor |
| **LiDAR** | Laser pulses → 3D point cloud | Precise 3D maps; works in dark; long range | Costly; degrades in fog/rain; no color | Autonomous navigation, SLAM, AVs |
| **Radar** | Radio waves | Works in fog/rain/dust; measures velocity | Low resolution | Outdoor, adverse weather, high speed |
| **Tactile/force sensors** | "Skin" measuring pressure/force | Enables delicate grasping | Immature, costly | Fine manipulation, fragile objects |

> **The defining industry debate:** *LiDAR + rich sensor suite* vs. *"vision-only" (cameras + AI)*. AI advances are making camera-only perception viable, threatening to commoditize expensive sensors — a critical fork for analysts to track. The LiDAR segment is simultaneously **consolidating** (Ouster absorbed Velodyne; Luminar's assets sold in bankruptcy) even as unit demand from robotics grows. [8]

### 4.2 Actuation ("the muscles") — the most concentrated, defensible layer
The components that produce motion. This layer has the **strongest competitive moats** and real supply bottlenecks.

- **Precision reducers / gearboxes:** The single most critical component. **Harmonic Drive holds ~85% of the harmonic-reducer market; Nabtesco supplies ~60% of RV reducers** for medium/large joints. A full-size humanoid needs ~14 harmonic + ~14 planetary reducers each — and Harmonic Drive's capacity is a live supply constraint as humanoids scale. [9][10]
- **Precision motors:** Maxon (Switzerland), Faulhaber (Germany), Portescap (US) together hold **>70%** of the precision-motor market; China's CubeMars/T-Motor grow fast on integrated servo actuators. [9]
- **Actuator types by power source:**
  - *Electric* — precise, clean, software-controllable → dominant, standard in humanoids.
  - *Hydraulic* — brute force, explosive motion → heavy machinery, legacy Atlas.
  - *Pneumatic* — light, cheap, compliant, imprecise → simple grippers, soft robotics.
  - *Soft/novel actuators* — light, human-safe → experimental, next-gen.

### 4.3 End-effectors ("the hands")
The tool at the end of the arm — grippers, welders, suction, dexterous hands. Dexterous multi-finger hands are a major bottleneck for humanoids (hard, expensive, unreliable at scale). A large ecosystem of specialist gripper makers exists (e.g., OnRobot, Schunk, SoftRobotics).

### 4.4 Intelligence & control ("the brain") — the layer changing everything
Historically robots were *explicitly programmed* for every motion. The shift now underway is toward **learned behavior** and **"physical AI"**:
- **Reinforcement learning** teaches robots to walk/balance/manipulate by learning rather than hand-coding (e.g., the new Boston Dynamics Atlas).
- **Robotics foundation models** aim to be a "GPT for robots" — one model generalizing across many tasks (Google DeepMind's Gemini Robotics; startups Physical Intelligence, Skild AI).
- **Simulation & compute** — NVIDIA's Isaac/Omniverse stack trains and simulates robots and is used across nearly the entire industry, making NVIDIA a near-universal supplier.

> This intelligence layer is why 2025–2026 is an inflection point: **cheap cameras + powerful AI** are moving general-purpose robots (especially humanoids) from lab to pilot deployment.

---

## 5. Application matrix — which robot for which job

A quick-reference cross-tab of **robot type → primary functionality → where it wins**.

| Robot type | Core functionality | Wins when… | Leading sectors |
|---|---|---|---|
| Articulated arm | Flexible manipulation | Task needs reach + varied angles | Automotive, general mfg |
| SCARA | Fast planar pick-and-place | High-speed flat assembly | Electronics, packaging |
| Cartesian/gantry | Precise linear motion, heavy loads | Large area or heavy parts | Logistics, heavy mfg, 3D printing |
| Delta/parallel | Ultra-fast light pick-and-place | Very high throughput, light parts | Food, pharma, packaging |
| Cobot | Safe human-adjacent tasks | High-mix, low-volume, no cages | SMEs, assembly, labs |
| AGV | Fixed-route transport | Stable, repetitive layouts | Warehousing, intralogistics |
| AMR | Flexible autonomous transport | Dynamic, changing environments | E-commerce, hospitals |
| Quadruped | Rough-terrain mobility + sensing | Inspection where wheels fail | Energy, security, construction |
| Humanoid | General-purpose human-space labor | Environment is built for humans | Logistics/mfg pilots (early) |
| Drone (UAV) | Aerial sensing/transport | Access from above, large areas | Agriculture, energy, defense |
| AUV/ROV | Subsea operation | Underwater, human-unsafe | Offshore energy, defense |
| Surgical robot | Precision teleoperation | Sub-mm precision, minimally invasive | Healthcare |
| Consumer service | Single domestic task | Mass-market, low price | Home |

---

## 6. Selection logic & glossary

### 6.1 Decision heuristics (how to reason about "which technology")
- **Flat, predictable floor?** → wheels (never over-engineer with legs).
- **Human-built environment (stairs, homes, factories)?** → legs / humanoid.
- **Task is *recognize what something is*?** → cameras + AI.
- **Task is *know where it is / how far*?** → depth camera or LiDAR.
- **Navigate a large space without collision?** → LiDAR + SLAM.
- **Grasp something delicately?** → depth + tactile sensing.
- **Maximum precision by software control?** → electric actuators.
- **Maximum raw force?** → hydraulic.
- **High-mix, low-volume, near people?** → cobot.
- **High-speed, high-volume, simple?** → SCARA or delta.

### 6.2 Where the durable value tends to sit (a lens for the next phase)
Three broad postures for the industry analysis to test:
1. **Picks-and-shovels (component layer):** reducers (Harmonic Drive, Nabtesco), motors (Maxon, Nidec), sensors (Sony, Orbbec, Ouster), and compute/software (NVIDIA). Sell to *everyone*; real bottlenecks confer pricing power.
2. **Established integrators (cash flow today):** the "Big Four/Five" — FANUC, ABB, Yaskawa, KUKA, Kawasaki — profitable industrial franchises with a humanoid optionality.
3. **Humanoid frontier (high risk/high reward):** Western AI-premium (Figure, Tesla, Agility) vs. Chinese cost-scale (Unitree, UBTECH). [7]

### 6.3 Glossary
- **DoF / axis** — independent direction a robot can move; more axes = more dexterity.
- **SLAM** — Simultaneous Localization And Mapping; building a map while tracking position in it.
- **Cobot** — collaborative robot; safe to work beside humans without cages.
- **End-effector** — the tool/hand at the end of a robot arm.
- **AGV / AMR** — guided (infrastructure-bound) vs. autonomous (free-navigating) mobile robots.
- **Reducer/gearbox** — gearing that converts motor speed to joint torque; harmonic and RV are the precision types.
- **Physical AI / foundation model** — large AI models that generalize control across many robot tasks.

---

## 7. Sources

Primary standards and statistical authorities are listed first, as the classification in Parts 1–3 is drawn directly from them.

1. **ISO 8373:2021 — *Robotics — Vocabulary*** (International Organization for Standardization, TC 299). The governing definitions of *robot*, *industrial robot*, *service robot*, *medical robot*, *wearable robot*. https://www.iso.org/standard/75539.html
2. ISO 8373:2021 published text (sample). https://cdn.standards.iteh.ai/samples/75539/1bc8409322eb4922bf680e15901852d2/ISO-8373-2021.pdf
3. **International Federation of Robotics (IFR)** — homepage & definitions portal. https://ifr.org/standardisation
4. **IFR — World Robotics 2025, Service Robots** (press release, global growth data). https://ifr.org/ifr-press-releases/news/service-robots-see-global-growth-boom
5. IFR — *Definition of Service Robots* (World Robotics methodology). https://ifr.org/img/worldrobotics/Definition_Service_Robots_2026.pdf
6. IFR — *Industrial Robots: Definition and Classification* (World Robotics methodology chapter — the six mechanical structures). https://ifr.org/img/office/Industrial_Robots_2016_Chapter_1_2.pdf
7. EVS Intelligence — *Top Humanoid Robot Companies 2026*. https://www.evsint.com/top-8-humanoid-robot-companies-2026/
8. TechCrunch — *Ouster's new color LiDAR is coming to replace cameras* (LiDAR consolidation). https://techcrunch.com/2026/05/04/ousters-new-color-lidar-is-coming-to-replace-cameras/
9. Jamestown Foundation — *New Gains in PRC Robotics Software & Hardware* (reducer & motor market shares). https://jamestown.org/new-gains-in-prc-robotics-software-hardware/
10. Harmonic Drive Systems — precision reducer technology. https://www.harmonicdrive.net/

---

*Prepared as a foundational technology reference. The next phase — industry structure, value-chain economics, and company-level analysis — should build directly on this taxonomy so that all analyst work shares common definitions. Corrections and additions welcome; this is a living document (v1.0).*
