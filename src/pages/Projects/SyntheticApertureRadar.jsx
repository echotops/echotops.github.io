import ProjectLayout, { Heading, Paragraph, Figure, FigureGrid } from '../../components/ProjectLayout/ProjectLayout'

// One page per project rather than one per year — see ProjectsGrid.jsx —
// so this links straight into /projects/ without a year segment in the URL.
export default function SyntheticApertureRadar() {
  return (
    <ProjectLayout
      category="Projects"
      categoryHref="/projects"
      title="Beaver Works Synthetic Aperture Radar"
      subtitle="Over the summer of 2024 I coded a radar and detected landmines at MIT"
    >
      <Heading>Range-Time Intensity Plots</Heading>
      <Paragraph>
        Over the summer of 2024, I had the opportunity to learn about and work with radars at
        MIT. The radar was a small ultra-wideband radar called the PulsON P440, and we communicated
        with it via Python scripts from a Raspberry Pi.
      </Paragraph>

      <Figure
        src="/projects/SyntheticApertureRadar/imgs/p440.jpeg"
        caption="Figure 1-1. PulsON P440 with two log-periodic antennae"
      />

      <Paragraph>
        The project consisted of a few phases, the first of which was writing the python program
        to interact with the PulsON 440. The data gained from the radar was then plotted on a
        range-time intensity plot, with range on the x-axis and time on the y-axis.
      </Paragraph>

      <FigureGrid>
        <Figure
          src="/projects/SyntheticApertureRadar/imgs/rti_1.png"
          caption="Figure 1-2. Range-time intensity plot depicting an object that starts 60m away and moves to 50m over 3 seconds"
        />
        <Figure
          src="/projects/SyntheticApertureRadar/imgs/rti_2.png"
          caption="Figure 1-3. Range-time intensity plot showing an object oscillating between 10m and 4m with a period of 3.5 seconds"
        />
      </FigureGrid>

      <Paragraph>
        We noticed it could be difficult to make out small objects or objects at far distances
        due to the radar's limited power, so we also created delta range-time intensity plots,
        which subtract two adjacent pulses to find the differences between them. Along with
        making motion easier to see, these plots had the added benefit of reducing the large
        initial pulse detected by the receiving antenna as the radar is transmitting.
      </Paragraph>

      <FigureGrid>
        <Figure
          src="/projects/SyntheticApertureRadar/imgs/rti_1_delta.png"
          caption="Figure 1-4. Range-time intensity delta plot of Figure 1-2"
        />
        <Figure
          src="/projects/SyntheticApertureRadar/imgs/rti_2_delta.png"
          caption="Figure 1-5. Range-time intensity delta plot of Figure 1-3"
        />
      </FigureGrid>

      <Heading>Time Domain Backprojection</Heading>
      <Paragraph>
        Once we had developed a method for plotting our radar returns, we focused on creating
        synthetic aperture radar maps. Synthetic aperture radar (SAR) is a technique used to
        increase resolution by overlaying multiple scans of the same target area. The same effect
        can be achieved by using a larger radar aperture, so in some sense we're creating
        a synthetic aperture by moving the radar. To create our images, we flew the radar on
        drones in MIT's high bay. We then used a system of infrared tracking cameras to get
        position data on the drone, and lined it up with our scan. We then combined the motion
        capture and radar data to form our own maps, generally of aluminum soda cans placed
        on the floor.
      </Paragraph>

      <Figure
        src="/projects/SyntheticApertureRadar/imgs/drone.jpeg"
        caption="Figure 2-1. PulsON 440 and Raspberry Pi assembly mounted below an F550 drone"
      />
      <Figure
        src="/projects/SyntheticApertureRadar/imgs/soda_cans.jpeg"
        caption="Figure 2-2. Arrangement of soda cans in the high bay, with retroflectors as known reference points"
      />

      <Paragraph>
        The final challenge was to use this technique to discover the pattern of soda cans
        hidden beneath a tarp on the floor.
      </Paragraph>

      <FigureGrid>
        <Figure
          src="/projects/SyntheticApertureRadar/imgs/final1.png"
          caption="Figure 2-3. Initial image generated from the final challenge"
        />
        <Figure
          src="/projects/SyntheticApertureRadar/imgs/final2.png"
          caption='Figure 2-4. Enhanced image, showing 24 cans arranged in a large "24"'
        />
      </FigureGrid>

      <Heading>Landmine Detection</Heading>
      <Paragraph>
        In the last week of the program, we were introduced to one possible application of synthetic
        aperture radar: using it to detect buried landmines. Representatives from MIT's Lincoln
        Laboratory presented the topic and explained that they too had been assigned to a similar
        project.
      </Paragraph>
      <Paragraph>
        To see if we could pick up the landmine, we went to one of the sand pits and set the
        radar up on a cart attached to a zipline. The cart would move across the wire at a constant
        speed, and had an encoder so we could know its position along the line. We then set
        up two reflectors, one in each corner of the sand pit, to act as references, and buried
        the landmine around one foot under the sand.
      </Paragraph>

      <Figure src="/projects/SyntheticApertureRadar/imgs/sand_pit.jpeg" caption="Figure 3-1. Sand pit and zipline setup" />

      <Paragraph>
        We did end up detecting the landmine. Figure 3-2 is a horizontal cross section
        of the sand pit, with the surface of the sand at 0m on the y-axis. The two reference
        reflectors are at 2m and 11m on the x-axis, and the landmine is clearly visible at 7m
        on the x-axis and about 0.3m below the surface return.
      </Paragraph>

      <Figure src="/projects/SyntheticApertureRadar/imgs/landmine.png" caption="Figure 3-2. SAR image of the sand pit" />

      <Paragraph>
        Of the five teams in the program, we were one of two that discovered the soda can pattern,
        and the only one to successfully detect the landmine.
      </Paragraph>
    </ProjectLayout>
  )
}
