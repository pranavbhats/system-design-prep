
import { CurrentUserInfoLoader } from "./CurrentUserInfoLoader";
import { ProductInfo } from "./ProductInfo";
import { ResourceLoader } from "./ResourceLoader";
import { UserInfo } from "./UserInfo";
import { UserLoader } from "./UserLoader";

function App() {

  return (
    <>
      <CurrentUserInfoLoader>
        <UserInfo/>
        <UserLoader userId="234">
          <UserInfo />
        </UserLoader>
      </CurrentUserInfoLoader>

      <ResourceLoader resourceUrl="products/3" resourceType="product">
        <ProductInfo />
      </ResourceLoader>
    </>
  )
}

export default App
