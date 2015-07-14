feature 'Database cleaning' do
  scenario 'Removes users from our test database' do
    visit '/'

    sign_up_with name: 'theo', email: 'me@example.com'

  end

end

def sign_up_with(args)
  fill_in('name', with: args[:name])
  fill_in('email', with: args[:email])
  click_on('submit')
end
