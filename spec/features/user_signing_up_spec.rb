feature 'User sign up' do

  scenario 'I can sign up as a new user' do
    visit '/'
    sign_up_with(name: "theo", email: "theo@gmail.com")
    expect(page).to have_content("Welcome, theo@gmail.com")
  end

end

def sign_up_with(args)
  fill_in('name', with: args[:name])
  fill_in('email', with: args[:email])
  click_on('submit')
end
