import { GetStaticProps } from "next"
import Header from "../../components/Header"
import {sanityClient, urlFor} from "../../sanity"
import { Post } from "../../typing"
import PortableText from "react-portable-text"
import {useForm, SubmitHandler} from "react-hook-form"
import { useState } from "react"

interface Props{
    post: Post
}

interface IFormInput{
    _id:string,
    name:string,
    email: string,
    comment: string

}

function Post({post}: Props) {
    console.log(post)


    const {register, handleSubmit, formState:{errors},} = useForm<IFormInput>()
    const [submitted, setSubmitted] = useState(false)

    const onSubmit: SubmitHandler<IFormInput> = async (data) =>{
        // console.log(data)
        await fetch('/api/createComment',{
            method: 'POST',
            body: JSON.stringify(data)
        }).then(()=>{
            console.log(data);
            setSubmitted(true)
        }).catch((err)=>{
            console.log(err);
            setSubmitted(false)
            
        })
    };


  return (
    <main>
        <Header/>
        <img className="w-full h-80 object-cover" src={urlFor(post.mainImage).url()!} alt=""/>
        <article className="max-w-3xl mx-auto p-5">
            <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
            <h2 className="text-xl font-light text-slate-500">{post.description}</h2>
            <div className="flex items-center space-x-2">
                <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url()!} alt=""/>
                <p className="font-extralight text-sm">Blog post by <span className=" text-green-500">{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString()}</p>
            </div>

            <div>
                <PortableText 
                className=""
                dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                content={ post.body ? post.body: []}
                serializers={{
                    h1:(props:any) =>(
                        <h1 className="text-2xl font-bold my-5" {...props}/>
                    ),
                    h2:(props:any) =>(
                        <h2 className="text-xl font-bold my-5" {...props}/>
                    ),
                    li:({children}:any) =>(
                        <li className="ml-4 list-disc">{children}</li>
                    ),
                    link:({href, children}:any) =>(
                        <a href={href} className="text-blue-500 hover:underline">
                            {children}
                        </a>
                    ),
                    img:(props:any) =>{
                        <img className=" m-10" {...props}/>
                    }

                }}
                />
            </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border border-gray-600"/>
        {submitted ? (
            <div className="flex flex-col py-10 my-10 px-10 bg-gray-400 text-white max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold">Thank you for submitting your comment!</h3>
                <p>It will appear once it has been approved</p>
            </div>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
            <h3 className="text-3xl font-bold text-gray-400">Leave a Comment Below!</h3>
            <hr className="py-3 mt-2"/>

            <input {...register("_id")} type="hidden" name="_id" value={post._id}/>
            <label className="block mb-5">
                <span className=" text-slate-700">Name</span>
                <input {...register("name", {required:true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none focus:ring-slate-700 " placeholder="Name" type="text" />
            </label>
            <label className="block mb-5">
                <span className=" text-slate-700">Email</span>
                <input {...register("email", {required:true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-slate-700" placeholder="Email@some.com" type="email" />
            </label>
            <label className="block mb-5"> 
                <span className=" text-slate-700">Comment</span>
                <textarea {...register("comment", {required:true})} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none ring-slate-700" placeholder="Comment" rows={8} />
            </label>
            <div className="flex flex-col p-5">
                {errors.name && (
                    <span className="text-red-400">The Name field is required</span>
                )}
                {errors.email && (
                    <span className="text-red-400">The Email field is required</span>
                )}
                {errors.comment && (
                    <span className="text-red-400">The Comment field is required</span>
                )}
            </div>

            <input type="submit" className="shadow bg-gray-400 hover:bg-gray-300 hover:text-gray-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer" />
        </form>

        )}

        <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-gray-500 shadow space-y-2">
            <h3 className="text-4xl">Comments</h3>
            <hr className="pb-2"/>
            {post.comments.map((comment)=>(
                <div key={comment._id}>
                    <p>
                        <span className=" text-green-400">{comment.name}</span>: {comment.comment}
                    </p>
                </div>
            ))}
        </div>

    </main>
  )
}

export default Post

export const getStaticPaths = async () =>{
    const query = `*[_type =="post"]{
        _id,
        slug{
        current
      }
      }`

      const posts = await sanityClient.fetch(query)
      const paths = posts.map((post: Post)=>({
        params: {
            slug: post.slug.current
        }
      }))

      return {
        paths,
        fallback: 'blocking'
      }
}

export const getStaticProps: GetStaticProps = async ({ params }) =>{
    const query = `*[_type =="post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author ->{
        name,
        image
        },
        'comments':*[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true
        ],
        description,
        mainImage,
        slug,
        body
      }`

      const post = await sanityClient.fetch(query, {
        slug: params?.slug,
      })

      if(!post){
          return {
            notFound: true
          }
      }

      return {
        props: {
            post,
        },
        revalidate: 60, 
      }
}
