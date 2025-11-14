import { UserInfo } from './UserInfo'
import { printProps } from './printProps'
const UserInfoWrapper = printProps(UserInfo)
const App = () => {

  return (
    <>
      <UserInfoWrapper user={{
        name: "John Doe",
        hairColor: "Black",
        age: 30,
        hobbies: ["Reading", "Gaming", "Coding"]
      }} />
    </>
  )
}

export default App
