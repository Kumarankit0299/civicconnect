'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { usePathname, useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'

import { createCommunity } from '@/lib/actions/community.actions'
import FileUpload from '../shared/FileUpload'

const formSchema = z.object({
    communityName: z.string().min(3, { message: 'Name is too short' }),
    image: z.string().optional(),
    username: z.string().min(5, { message: 'Username must be at least 5 characters' }),
    bio: z.string().optional(),
    city: z.string().min(2, { message: 'Invalid City' }),
    pinCode: z.string().min(6, { message: 'Invalid zip code' }).max(6, { message: 'Invalid zip code' }),
    state: z.string().min(3, { message: 'Invalid State' }),
})


interface CreateCommunityProps {
    userId: string,
    city?: string,
    pinCode?: string,
    state?: string,
}

const CreateCommunity: React.FC<CreateCommunityProps> = ({
    userId,
    city,
    pinCode,
    state,
}) => {
    const pathname = usePathname()

    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            communityName: '',
            username: '',
            image: '',
            bio: '',
            city: city || '',
            pinCode: pinCode || '',
            state: state || '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await createCommunity({
                name: values.communityName,
                username: values.username.toLowerCase(),
                image: values.image || '',
                bio: values.bio || '',
                city: values.city,
                pincode: values.pinCode,
                state: values.state,
                createdById: userId,
            })

            if (!response) throw new Error('No response from server')
            if(response?.error){
                return alert(response.error)
            }
            router.push(`/communities/${response.toString()}`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card className="w-full dark border-1 mt-[-30px]">
            <CardHeader>
                <CardTitle className='text-heading2-semibold'>Community Detail</CardTitle>
                <CardDescription>Fill all the fields</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 sm:space-y-6"
                    >
                        <FormField

                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Community Logo</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            apiEndpoint="communityImg"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex md:flex-row gap-4">
                            <FormField

                                control={form.control}
                                name="communityName"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Community Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="Community name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField

                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Community Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Community Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex md:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Community Bio</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Community Bio"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField

                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="State"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex md:flex-row gap-4">
                            <FormField

                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="City"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField

                                control={form.control}
                                name="pinCode"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Pincode</FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="Pincode"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"

                        >
                            Create Community
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateCommunity