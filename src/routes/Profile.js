import React, { PureComponent } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestore } from '../lib/firebase'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import Layout from '../components/UserLayout'
import Loading from '../components/Loading'
import Navbar from '../components/styles/Navbar'

const UserCover = styled.div`
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: bottom;
  background-size: cover;
  /* Temporary */
  background-image: url(https://lorempixel.com/1920/1080/);
  height: 100%;
  text-align: center;
  & p {
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 10px;
    font-size: 60px;
  }
  & img {
    border-radius: 50%;
    border: 3px solid #fff;
    height: 200px;
    width: 200px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  & #verified {
    border: 3px solid #fd267d;
  }
  & .follow {
    height: 100%;
    padding: 5px;
    padding-top: 10px;
    text-align: center;
  }
  & .follow-me {
    cursor: pointer;
    border: none;
    background: #fd267d;
    color: #fff;
    width: 20%;
    padding: 10px;
    margin-top: 20px;
    font-size: 20px;
  }
  & .followers {
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    height: auto;
    width: auto;
    margin: 0 1vw;
    padding: 10px;
    font-size: 18px;
  }
  & .following {
    border-radius: 50px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    height: auto;
    width: auto;
    margin: 0 1vw;
    padding: 10px;
    font-size: 18px;
  }
  @media (max-width: 768px) {
    & p {
      font-size: 50px;
    }
    & img {
      height: 150px;
      width: 150px;
    }
    & follow-me {
      width: 60% !important;
    }
  }
  @media (max-width: 991px) {
    & .follow-me {
      width: 30%;
    }
  }
  @media (height: 1024px) {
    & .follow-me {
      width: 30% !important;
    }
  }
`

const LoadingText = () => <h1 style={{ marginLeft: '25%' }}>Loading....</h1>

const SettingsRoute = Loadable({
  loader: () => import('./profile/settings'),
  loading: LoadingText
})

class Profile extends PureComponent {
  static defaultProps = {
    otherUser: false
  }
  state = {
    user: null
  }
  componentWillMount () {
    this.fetchUser(this.props.otherUser)
  }
  fetchUser = otherUser => {
    if (otherUser) {
      // firebase now in action
      const userId = this.props.match.params.id
      firestore
        .collection('users')
        .doc(userId)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return this.setState({
              user: false
            })
          }
          return this.setState({
            user: {
              displayName: doc.data().displayName,
              photoURL: doc.data().photoURL
            }
          })
        })
    } else {
      this.setState({
        user: this.props.user
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.otherUser !== this.props.otherUser) {
      this.fetchUser(nextProps.otherUser)
    }
  }
  render () {
    let links = [
      {
        name: 'Posts',
        href: '/profile/projects'
      },
      {
        name: 'Repos',
        href: '/profile/feed'
      },
      {
        name: 'Images',
        href: '/profile/images'
      },
      {
        name: 'Friends',
        href: '/profile/friends'
      },
      {
        name: 'Settings',
        href: '/profile/settings'
      }
    ]
    if (this.props.otherUser) {
      links.pop()
      links = links.map(link => ({
        name: link.name,
        href: link.name.replace('profile', `user/${this.props.match.params.id}`)
      }))
    }
    if (this.state.user === null) {
      return <Loading />
    }

    if (this.state.user === false) {
      return <Redirect to="/404" />
    }
    const { displayName, photoURL } = this.state.user
    return (
      <Layout>
        <UserCover>
          <p>{displayName}</p>
          <img src={photoURL} alt="profile" />
          <div className="follow">
            <span className="followers">Followers</span>
            <span className="following">Following</span>
            <br />
            <button className="follow-me">Follow</button>
          </div>
        </UserCover>
        <Navbar links={links} />
        {!this.props.otherUser && (
          <Route
            path={`${this.props.match.url}/settings`}
            component={SettingsRoute}
          />
        )}
      </Layout>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Profile)
