import logo from '@/assets/logo.png'

export default function OrganizationLogo() {
  return (
    <div className="flex justify-start bg-white">
      <img src={logo} alt="组织 LOGO" className="h-16 w-auto" />
    </div>
  )
}
