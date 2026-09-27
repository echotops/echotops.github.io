import ProjectLayout, { Heading, Paragraph, Figure, FigureGrid, Table } from '../../components/ProjectLayout/ProjectLayout'

// Consolidated write-up for the liquid propulsion subteam — one page per
// project rather than one per year, so a multi-year project gets a single
// card/page instead of a separate entry per year (see ProjectsGrid.jsx).
export default function DukeAeroLiquids() {
  return (
    <ProjectLayout
      category="Projects"
      categoryHref="/projects"
      title="DukeAERO Liquid Propulsion"
      subtitle="Fluid Systems Team Lead for Duke's first liquid rocket motor"
    >
      <Heading>2026-27</Heading>
      <Paragraph>
        For my second year, we've decided to redefine the DukeAERO liquids project, starting new with
        Project Prometheus, an IPA/NOX engine. As lead of the fluid systems team, I was responsible
        for designing the hardware upstream of the injector, including the tanks, propellant lines, and
        valves. Project Prometheus is a 2-year project with a launch target of the summer of 2028. Most
        of the work so far has been on the design side, with manufacturing starting to pick up.
      </Paragraph>

      <Paragraph>
        Prometheus has a target apogee of 15,000 ft. To reach this height, we plan on burning for around
        6 seconds, with a mass flow of 1.73 kg/s, and an O/F ratio of 2.6. We are using NOX's vapor pressure
        to pressurize the tank to 900 PSI, bleeding some NOX to pressurize the IPA tank to 400 PSI. The
        NOX and IPA are separated by a dynamic piston, taking inspiration from Half Cat Rocketry. The IPA
        pressure is then increased with an electric pump before being sent to the engine.
      </Paragraph>

      <Paragraph>
        Once we had established these design targets, I had to figure out where to start. Beginning with
        a preliminary piping and instrumentation diagram (P&ID), I was able to plan out the design of the
        entire system (Figure 1-1). I chose 1/4" lines for intermediary lines where pressure drop wasn't a
        concern, like fill lines, while the IPA and NOX propellant lines to the chamber use 1/2" and 3/4"
        respectively to lower flow velocity and pressure losses. 
      </Paragraph>

      <Figure src="/projects/DukeAeroLiquids/imgs/pid.png" caption="Figure 1-1. Piping and instrumentation diagram for Project Prometheus. The flight stack is on the left, with ground fill infrastructure on the right." />

      <Paragraph>
        Given our target mass flow, burn time, and O/F ratio, I sized the propellant tanks. I then
        designed closures for the tanks with the required NPT taps, choosing an ellipsoidal design
        to save weight. The IPA piston also utilizes an ellipsoidal profile, scaled down to fit into
        the concave side of the closure once the IPA tank has fully drained. Each closure is projected
        to weigh about 0.85 lbs, while the IPA piston weighs just over 0.55 lbs.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/DukeAeroLiquids/imgs/closure_cad.png" caption="Figure 1-2. Unified IPA and NOX tank closure. Design WIP" />
        <Figure src="/projects/DukeAeroLiquids/imgs/closure_fea.png" caption="Figure 1-3. Results of the FEA simulation on the tank and closure, with a minimum FoS of 1.4" />
      </FigureGrid>
      <FigureGrid>
        <Figure src="/projects/DukeAeroLiquids/imgs/piston_cad.png" caption="Figure 1-4. IPA piston" />
        <Figure src="/projects/DukeAeroLiquids/imgs/piston_fea.png" caption="Figure 1-5. Results of an FEA run on the IPA piston, with a minimum FoS of 1.7" />
      </FigureGrid>

      <Figure src="/projects/DukeAeroLiquids/imgs/ipa_tank.png" caption="Figure 1-6. IPA tank assembly, including the top and bottom closures, and the IPA piston" />

      <Paragraph>
        Once I designed the parts and ensured they passed FEA, I used our lathe and CNC mill
        to manufacture them.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/DukeAeroLiquids/imgs/piston_wip.png" caption="Figure 1-7. IPA piston machining in progress" />
        <Figure src="/projects/DukeAeroLiquids/imgs/piston.png" caption="Figure 1-8. Finished IPA piston" />
      </FigureGrid>

      <Paragraph>
        In addition to the hardware design and manufacturing, I've written two injector scripts,
        one for IPA and one for NOX, to determine our injector geometry. The NOX script accounts for
        choking as it flashes in the injector using Dyer's NHNE model, with heavy reference to
        {' '} <a href="https://ntrs.nasa.gov/api/citations/20190001326/downloads/20190001326.pdf" target="_blank" rel="noreferrer">
          Waxman et al.
        </a> {' '}
        By combining the IPA and NOX blowdown scripts, I wrote 
        {' '} <a href="https://github.com/echotops/rocketry/tree/main/prometheus-analyzer" target="_blank" rel="noreferrer">
          prometheus-analyzer
        </a>, {' '}
        a program that would simulate the rocket's
        performance over time given some initial conditions like propellant masses and pressures, and
        injector geometry.
      </Paragraph>

      <Figure src="/projects/DukeAeroLiquids/imgs/sim_perf.png" caption="Figure 1-9. Performance results of the simulation" />
      <FigureGrid>
        <Figure src="/projects/DukeAeroLiquids/imgs/sim_nox.png" caption="Figure 1-10. NOX results of the simulation" />
        <Figure src="/projects/DukeAeroLiquids/imgs/sim_ipa.png" caption="Figure 1-11. IPA results of the simulation" />
      </FigureGrid>

      <Heading>2025-26</Heading>
      <Paragraph>
        In my first year on the liquid propulsion subteam, I helped to develop
        {' '} <a href="https://github.com/echotops/rocketry/tree/main/eno-analyzer" target="_blank" rel="noreferrer">
          eno-analyzer
        </a>, {' '}
        a Python script to find pressure losses through our piping upstream of the injector in our
        liquid engine Eno, which was later cancelled in favor of Project Prometheus (see 2026-27).
        To run the simulation, relevant parameters, such as the injector specifications,
        propellant characteristics, and pipe elements and their dimensions, as well as the tank pressure
        and ambient chamber pressure are entered (Figure 2-1). The simulation is then run with
        a specified maximum number of iterations, and it will iterate until the solution has
        sufficiently converged (Figure 2-2).
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/DukeAeroLiquids/imgs/setup.png" caption="Figure 2-1. Example simulation input parameters " />
        <Figure src="/projects/DukeAeroLiquids/imgs/solution.png" caption="Figure 2-2. Results of the simulation" />
      </FigureGrid>

      <Paragraph>
        The simulation works by calculating the pressure losses through each element, and comparing
        the mass flow through the flowmeter and through the injector. The script then iteratively
        varies the mass flow rate of the propellant until continuity is maintained throughout
        the system. By default it checks for a mass flow difference of less than 1e-6 kg/s,
        but a different threshold can be sent as an argument to the solve function.
      </Paragraph>
      <Paragraph>
        By tuning the characteristics of the piping elements, the simulation can be made to closely
        approximate the results of actual testing (Table 2-1). Ideally, this simulation will
        then be able to generate the expected pressure losses through the system given
        different tank pressures.
      </Paragraph>

      <Table
        headers={['Run', 'FM Upstream (PSI)', 'FM Loss (PSI)', 'FM Mass Flow (kg/s)', 'INJ Loss (PSI)', 'INJ Mass Flow (kg/s)']}
        rows={[
          ['11/22/25', '624.7', '168.1', '0.260', '283.7', '0.260'],
          ['Sim', '648.9', '166.0', '0.262', '256.1', '0.262'],
        ]}
        caption="Table 2-1: Values from a cold flow on 11/22/25 and a simulation run measured at the flowmeter (FM) and injector (INJ) for an 850 PSI tank pressure"
      />
    </ProjectLayout>
  )
}
