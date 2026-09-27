import ProjectLayout, { Heading, Paragraph, Figure, FigureGrid } from '../../components/ProjectLayout/ProjectLayout'

// Mock layout for this write-up, built from the images in
// public/projects/TelescopeMount/imgs/ (v1/v2/v3 = CAD design iterations
// of the mount itself, first/second/third = a progression of Saturn shots
// taken through it) — no real copy yet, just Paragraph placeholders marking
// where each section's text goes. Swap the bracketed placeholders for the
// real write-up; the structure/figures shouldn't need to change.
export default function TelescopeMount() {
  return (
    <ProjectLayout
      category="Projects"
      categoryHref="/projects"
      title="Telescope iPhone Mount"
      subtitle="Camera stabilization for astrophotography"
    >
      <Heading>Background</Heading>
      <Paragraph>
        Over the summer of 2026, I became interested in astronomy. I was handed down a 76x700mm Newtonian
        telescope, and was ecstatic the first time I saw Saturn's rings in the eyepiece (Figure 1-1).
        Since then I worked to afford an 8in Newtonian, and a 5mm eyepiece for it, enough resolution
        to pick out a few of Saturn's moons.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/TelescopeMount/imgs/first.png" caption="Figure 1-1. Saturn through a 76x700mm telescope with a 12.5mm eyepiece, captured by an iPhone 17 Pro" />
        <Figure src="/projects/TelescopeMount/imgs/second.png" caption="Figure 1-2. Saturn through a 200x1200mm telescope with a 5mm eyepiece, captured by an iPhone 17 Pro. Also visible are the moons Titan, Rhea, and Dione." />
      </FigureGrid>

      <Paragraph>
        I quickly realized that taking images through the eyepiece was incredibly challenging. I ended up
        using the Live Photo feature, which took a video and allowed me to select a specific frame as I
        shifted the camera back and forth across the eyepiece, trying to hold the image steady. Still, the motion
        degrades the image quality and makes light sources trail, as seen with the moon Titan to the bottom left
        of Saturn in Figure 1-2. My solution was to design a fixture that attaches to the eyepiece and
        my phone, allowing me to make small adjustments in the position of the phone.
      </Paragraph>

      <Heading>Design</Heading>
      <Paragraph>
        While researching the problem, I came across a project called OpenOcular that solved an
        almost identical problem, albeit for microscopes. Starting with OpenOcular's v3 design, I
        found shortcomings I could address, including the stability of the z-axis mount and the overall
        weight distribution of the mount. My first design version (Figure 2-1) moved OpenOcular's z-axis
        gear to the top of the viewfinder, increasing the counterbalance to the weight of the phone. I also
        decreased the length of the arm so the phone is held higher up, decreasing the tendency for the phone
        to rotate in the x-y plane, and I widened the phone supports.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/TelescopeMount/imgs/v1.png" caption="Figure 2-1. Version 1, a modified OpenOcular 3 (https://www.instagram.com/p/DCHnB9cvhTs/)" />
        <Figure src="/projects/TelescopeMount/imgs/v2.png" caption="Figure 2-2. Version 2, adding reinforcements and shifting the arm" />
      </FigureGrid>

      <Paragraph>
        After printing Version 1, I was satisfied with my design, and was excited to test it when
        I went home for break. However, a few days later, I accidentally knocked it off my desk
        while I was working and broke the z-axis rack. I'm glad I did, because it revealed a weak spot
        in the design, and allowed me to fix it. I added reinforcement to the z-axis strut, and
        shifted the arm to the left side of the viewfinder, accounting for the fact that the iPhone's
        cameras are offset to the right when viewed from the screen side. These changes constituted Version
        2 (Figure 2-2).
      </Paragraph>

      <Heading>Results</Heading>
      <Paragraph>
        I haven't been able to test it yet, but I will once I'm home for break. For now enjoy my best capture of
        Saturn below, using Live Photo and picking the best frame.
      </Paragraph>

      <FigureGrid>
        <Figure src="/projects/TelescopeMount/imgs/third.png" caption="Figure 3-1. Saturn through a 200x1200mm telescope with a 5mm eyepiece, captured by an iPhone 17 Pro, handheld with lighting and color edits" />
      </FigureGrid>

    </ProjectLayout>
  )
}
