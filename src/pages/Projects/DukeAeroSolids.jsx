import ProjectLayout, { Heading, Paragraph, Figure, FigureGrid, Table } from '../../components/ProjectLayout/ProjectLayout'

// Consolidated write-up for the solid propulsion subteam — one page per
// project rather than one per year, so a multi-year project gets a single
// card/page instead of a separate entry per year (see ProjectsGrid.jsx).
export default function DukeAeroSolids() {
  return (
    <ProjectLayout
      category="Projects"
      categoryHref="/projects"
      title="DukeAERO Solid Propulsion"
      subtitle="Designing and refining solid rocket motors"
    >
      <Heading>2026-27</Heading>
      <Paragraph>
        Nothing yet! Check back soon for updates!
      </Paragraph>

      <Heading>2025-26</Heading>
      <Paragraph>
        In my first year on the solid propulsion subteam, I optimized the team's rocket nozzle.
        The previous year's design (24-25 C) was a conical converging-diverging nozzle with converging
        and diverging angles of 40 and 15 degrees respectively, and an expansion ratio of 4.49.
      </Paragraph>
      <Paragraph>
        To increase performance, I rederived all the required parameters starting from a chamber
        pressure of 590 PSI from the previous year's static hot fire and our known grain geometry. I
        found the mass flow rate, and used it to calculate the throat area. Then I calculated
        the exit Mach number based on the chamber pressure and ambient pressure (assuming sea
        level). I then calculated the expansion ratio, and the exit area.
      </Paragraph>
      <Paragraph>
        I found an optimal expansion ratio of 5.81, noticeably higher than the previous year. To test my calculations,
        I ran two simulations (Figures 1-1 and 1-2) in Ansys Fluent, one with last year's nozzle
        and one with my redesign (25-26 C), and compared the resultant exit pressure, exit velocity,
        and mass flow to calculate thrust and specific impulse for each.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/DukeAeroSolids/imgs/25-6_c_mach.png" caption="Figure 1-1. Revised conical nozzle Mach" />
        <Figure
          src="/projects/DukeAeroSolids/imgs/25-6_c_pressure.png"
          caption="Figure 1-2. Revised conical nozzle static pressure"
        />
      </FigureGrid>

      <Paragraph>
        The performance gains from increasing the expansion ratio were marginal, yielding only about
        20N more thrust and 0.1s more ISP (Table 1-1). However, Ansys confirmed that this new nozzle was optimally expanded for
        sea level, with a gauge exit pressure far closer to 0. I continued research and found a further
        optimization using a Rao nozzle, in which the walls of the diverging section are contoured. Using
        Rao's method, I designed a new bell nozzle based on the previously calculated expansion ratio (25-26 R),
        and reran the simulations (Figures 1-3 and 1-4).
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/DukeAeroSolids/imgs/25-6_r_mach.png" caption="Figure 1-3. Revised Rao nozzle Mach" />
        <Figure
          src="/projects/DukeAeroSolids/imgs/25-6_r_pressure.png"
          caption="Figure 1-4. Revised Rao nozzle static pressure"
        />
      </FigureGrid>

      <Paragraph>
        This time I gained around 70N of thrust and 2.6s of ISP (Table 1-1) over the optimized
        conical nozzle, giving a total increase of about 90N and 2.7s from the previous year's design.
      </Paragraph>

      <Table
        headers={['Name', 'Exit Pressure (Pa)', 'Exit Mach', 'Exit Velocity (m/s)', 'Mass Flow (kg/s)', 'Thrust (N)', 'ISP (s)']}
        rows={[
          ['24-25 C', '38983', '2.718', '2340', '2.418', '5837', '246.3'],
          ['25-26 C', '-2459', '2.904', '2422', '2.423', '5853', '246.5'],
          ['25-26 R', '-3083', '2.917', '2449', '2.428', '5926', '249.1'],
        ]}
        caption="Table 1-1: Performance from Ansys Fluent runs of the three nozzles"
      />

      <Paragraph>
        Despite the larger performance increase with the bell nozzle, the team decided that the
        increased manufacturing complexity was not worth the performance gain. After deciding on
        the 25-26 C nozzle design, I created a CAD model of our three-piece nozzle, consisting of
        a converging phenolic section, a diverging phenolic section, the carbon throat, and the 6061-T6
        nozzle washer (Figure 1-5). The updated expansion ratio of 5.81 was used, and while the diverging
        half angle was kept at 15 degrees, the converging half angle was increased to 60 degrees to reduce
        the nozzle length and save weight.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/DukeAeroSolids/imgs/cad2.png" caption="Figure 1-5. 25-26 C nozzle cross section" />
        <Figure src="/projects/DukeAeroSolids/imgs/nozzle.jpg" caption="Figure 1-6. DukeAero 2025-26 nozzle" />
      </FigureGrid>

      <Paragraph>
        The nozzle performed nominally during our static hot fire test in April, 2026, and our launch
        in June, 2026, pushing the rocket to an apogee of 29,400ft.
      </Paragraph>

      <Figure src="/projects/DukeAeroSolids/imgs/shf_data.png" caption="Figure 1-7. Static hotfire chamber pressure and thrust data" />
    </ProjectLayout>
  )
}
