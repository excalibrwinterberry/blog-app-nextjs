/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/react-in-jsx-scope */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity' 
import {Post} from "../typing"

interface Props{
  posts: [Post];
}

const Home = ({posts}: Props) => {
  // console.log(posts);
  
  return (
    <div className=" max-w-7xl mx-auto">
      <Head>
        <title>Blog </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className='flex justify-between items-center bg-gray-500 border-black py-10 lg:py-5'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'> <span className='underline decoration-violet-200'>Welcome to Blog!</span>  Enjoy the articles below</h1>
          <h2>It's a place for me to explore my writing on various topics, and for you to enjoy the articles 
            and hopefully gain some knowledge while at it.</h2>
        </div>

        <img className='hidden md:inline-flex h-32 lg:h-full' src='https://i.postimg.cc/7LPg9ssQ/logo-blog.png' alt=''/>
      </div>

      {/* Posts */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map(post =>{
          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className='border rounded-lg group cursor-pointer overflow-hidden' >
                <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' 
                src={urlFor(post.mainImage).url()} alt='' />
                <div className='flex justify-between p-5 bg-gray-200'>
                  <div>
                    <p>{post.title}</p>
                    <p>{post.description} by {post.author.name}</p>
                  </div>
                  <img className='h-12 w-12 rounded-full ' src={urlFor(post.author.image).url()!} alt="author"/>

                </div>
              </div>
            </Link>
          )
        })}

      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async () =>{
  const query = `*[_type =="post"]{
    _id,
    title,
    author ->{
    name,
    image
    },
    description,
    mainImage,
    slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props:{
      posts,
    }
  }
}