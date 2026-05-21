const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map((part, i) => <Part key={part.id} part={parts[i]}/>)}
  </div>
)

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Total = ({total}) => <p>Number of exercises {total}</p>

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={course.parts.reduce((sum, part) => sum + part.exercises, 0)}
      />
    </div>
  )
}

export default Course